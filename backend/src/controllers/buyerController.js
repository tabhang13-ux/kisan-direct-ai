const prisma = require('../utils/prisma');
const { findMatchedSuppliers } = require('../services/matchingService');

const createRequirement = async (req, res) => {
  try {
    const buyerProfile = req.user.buyerProfile;
    if (!buyerProfile) {
      return res.status(400).json({ error: 'User does not have a buyer profile.' });
    }

    const { cropName, quantityKg, maxPricePerKg, requiredByDate, deliveryLocation } = req.body;

    if (!cropName || !quantityKg || !maxPricePerKg) {
      return res.status(400).json({ error: 'Crop name, quantity (kg), and max price per kg are required.' });
    }

    const requirement = await prisma.buyerRequirement.create({
      data: {
        buyerId: buyerProfile.id,
        cropName,
        quantityKg: parseFloat(quantityKg),
        maxPricePerKg: parseFloat(maxPricePerKg),
        requiredByDate: requiredByDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        deliveryLocation: deliveryLocation || req.user.location || 'Hadapsar Hub, Pune',
        latitude: req.user.latitude || 18.5204,
        longitude: req.user.longitude || 73.8567
      }
    });

    // Run Smart Supplier Matching Engine immediately
    const matchResults = await findMatchedSuppliers(requirement.id);

    // Save match scores to DB
    for (const item of matchResults.rankedMatches) {
      await prisma.supplierMatch.create({
        data: {
          requirementId: requirement.id,
          listingId: item.listingId,
          matchScore: item.matchScore,
          distanceKm: item.distanceKm,
          isAggregated: matchResults.aggregationStatus.isAggregated
        }
      });
    }

    // Notify user
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        title: 'Requirement Posted & Matched',
        message: `Posted requirement for ${quantityKg} kg ${cropName}. ${matchResults.rankedMatches.length} matching suppliers found.`,
        type: 'ORDER'
      }
    });

    res.status(201).json({
      requirement,
      matchResults
    });
  } catch (error) {
    console.error('Error creating requirement:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRequirements = async (req, res) => {
  try {
    const buyerProfile = req.user.buyerProfile;
    const requirements = await prisma.buyerRequirement.findMany({
      where: buyerProfile ? { buyerId: buyerProfile.id } : {},
      include: {
        supplierMatches: {
          include: { listing: { include: { farmer: { include: { user: true } } } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(requirements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRequirement,
  getRequirements
};
