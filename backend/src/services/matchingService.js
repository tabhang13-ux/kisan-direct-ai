const prisma = require('../utils/prisma');

// Haversine distance calculator in JS
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 15.0; // Default distance if unspecified
  const R = 6371.0;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates weighted match score between a Buyer Requirement and a Produce Listing
 */
function calculateMatchScore(requirement, listing) {
  // 1. Price Compatibility (35%)
  // If listing price <= max buyer price -> 100%, else degraded score
  let priceScore = 100;
  if (listing.askingPricePerKg > requirement.maxPricePerKg) {
    const diff = listing.askingPricePerKg - requirement.maxPricePerKg;
    priceScore = Math.max(0, 100 - (diff / requirement.maxPricePerKg) * 200);
  } else {
    // Reward lower asking price
    const savings = requirement.maxPricePerKg - listing.askingPricePerKg;
    priceScore = Math.min(100, 85 + (savings / requirement.maxPricePerKg) * 50);
  }

  // 2. Distance Score (25%)
  const distanceKm = calculateDistanceKm(
    requirement.latitude, requirement.longitude,
    listing.latitude, listing.longitude
  );
  // Score 100 for <= 10km, drops linearly to 0 at 150km
  let distanceScore = Math.max(0, 100 - (distanceKm / 150) * 100);

  // 3. Quantity Availability (20%)
  const qtyRatio = listing.quantityKg / requirement.quantityKg;
  let quantityScore = 100;
  if (qtyRatio >= 1.0) {
    quantityScore = 100; // Fully fulfills or exceeds requirement
  } else {
    quantityScore = Math.round(qtyRatio * 100); // Partial fulfillment ratio
  }

  // 4. Delivery Capability (10%)
  let deliveryScore = listing.qualityGrade === 'ORGANIC_PREMIUM' || listing.qualityGrade === 'GRADE_A' ? 95 : 80;

  // 5. Supplier Reliability (10%)
  let reliabilityScore = listing.farmer ? (listing.farmer.landSizeAcres > 3 ? 90 : 82) : 85;

  // Total Weighted Match Score
  const totalScore = (
    (priceScore * 0.35) +
    (distanceScore * 0.25) +
    (quantityScore * 0.20) +
    (deliveryScore * 0.10) +
    (reliabilityScore * 0.10)
  );

  return {
    matchScore: Math.round(totalScore),
    distanceKm,
    priceScore: Math.round(priceScore),
    distanceScore: Math.round(distanceScore),
    quantityScore: Math.round(quantityScore),
    deliveryScore: Math.round(deliveryScore),
    reliabilityScore: Math.round(reliabilityScore)
  };
}

/**
 * Finds top matching suppliers and checks for multi-farmer supply aggregation
 */
async function findMatchedSuppliers(requirementId, maxResults = 10) {
  const requirement = await prisma.buyerRequirement.findUnique({
    where: { id: requirementId },
    include: { buyer: { include: { user: true } } }
  });

  if (!requirement) {
    throw new Error('Buyer requirement not found');
  }

  // Find active listings matching crop name
  const listings = await prisma.produceListing.findMany({
    where: {
      cropName: { contains: requirement.cropName },
      status: 'AVAILABLE'
    },
    include: {
      farmer: { include: { user: true } },
      fpo: { include: { user: true } }
    }
  });

  const matches = [];

  for (const listing of listings) {
    const scores = calculateMatchScore(requirement, listing);
    matches.push({
      listingId: listing.id,
      listing,
      supplierName: listing.fpo ? listing.fpo.fpoName : listing.farmer.user.name,
      supplierType: listing.fpo ? 'FPO' : 'Individual Farmer',
      cropName: listing.cropName,
      availableQuantityKg: listing.quantityKg,
      askingPricePerKg: listing.askingPricePerKg,
      matchScore: scores.matchScore,
      distanceKm: scores.distanceKm,
      scores,
      harvestDate: listing.harvestDate,
      qualityGrade: listing.qualityGrade,
      isOrganic: listing.isOrganic,
      location: listing.location
    });
  }

  // Sort descending by match score
  matches.sort((a, b) => b.matchScore - a.matchScore);

  // Check for Multi-Farmer Aggregation
  let aggregatedTotalQty = 0;
  const aggregatedSuppliers = [];
  let isAggregationNeeded = false;

  for (const match of matches) {
    if (aggregatedTotalQty < requirement.quantityKg) {
      aggregatedTotalQty += match.availableQuantityKg;
      aggregatedSuppliers.push({
        id: match.listingId,
        supplierName: match.supplierName,
        supplierType: match.supplierType,
        contributedQtyKg: Math.min(match.availableQuantityKg, requirement.quantityKg - (aggregatedTotalQty - match.availableQuantityKg)),
        pricePerKg: match.askingPricePerKg,
        distanceKm: match.distanceKm,
        matchScore: match.matchScore
      });
    }
  }

  if (matches.length > 0 && matches[0].availableQuantityKg < requirement.quantityKg) {
    isAggregationNeeded = true;
  }

  return {
    requirementId: requirement.id,
    cropName: requirement.cropName,
    requestedQuantityKg: requirement.quantityKg,
    maxPricePerKg: requirement.maxPricePerKg,
    rankedMatches: matches.slice(0, maxResults),
    aggregationStatus: {
      isAggregated: isAggregationNeeded,
      totalFulfilledQtyKg: Math.min(aggregatedTotalQty, requirement.quantityKg),
      fulfillmentPct: Math.min(100, Math.round((aggregatedTotalQty / requirement.quantityKg) * 100)),
      participatingSuppliers: aggregatedSuppliers,
      message: isAggregationNeeded
        ? `Requirement of ${requirement.quantityKg} kg is fulfilled through FPO aggregation across ${aggregatedSuppliers.length} suppliers.`
        : `Single supplier directly satisfies total requested quantity.`
    }
  };
}

module.exports = {
  calculateDistanceKm,
  calculateMatchScore,
  findMatchedSuppliers
};
