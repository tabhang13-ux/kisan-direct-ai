const prisma = require('../utils/prisma');

const getFPODashboard = async (req, res) => {
  try {
    const fpoProfile = req.user.fpoProfile;
    if (!fpoProfile) {
      return res.status(400).json({ error: 'User does not have an FPO profile.' });
    }

    const memberFarmers = await prisma.farmerProfile.findMany({
      where: { fpoId: fpoProfile.id },
      include: {
        user: true,
        listings: true
      }
    });

    const fpoListings = await prisma.produceListing.findMany({
      where: { fpoId: fpoProfile.id },
      include: { farmer: { include: { user: true } } }
    });

    // Compute collective inventory totals by crop
    const collectiveInventoryMap = {};
    for (const item of fpoListings) {
      if (!collectiveInventoryMap[item.cropName]) {
        collectiveInventoryMap[item.cropName] = {
          cropName: item.cropName,
          totalQuantityKg: 0,
          avgAskingPrice: 0,
          farmerCount: new Set(),
          listingsCount: 0
        };
      }
      collectiveInventoryMap[item.cropName].totalQuantityKg += item.quantityKg;
      collectiveInventoryMap[item.cropName].avgAskingPrice += item.askingPricePerKg;
      collectiveInventoryMap[item.cropName].farmerCount.add(item.farmerId);
      collectiveInventoryMap[item.cropName].listingsCount += 1;
    }

    const collectiveInventory = Object.values(collectiveInventoryMap).map(inv => ({
      ...inv,
      avgAskingPrice: Math.round((inv.avgAskingPrice / inv.listingsCount) * 10) / 10,
      farmerCount: inv.farmerCount.size
    }));

    const activeRequirements = await prisma.buyerRequirement.findMany({
      where: { status: 'OPEN' },
      include: { buyer: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      fpoProfile,
      memberCount: memberFarmers.length,
      memberFarmers,
      fpoListings,
      collectiveInventory,
      activeRequirements
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const aggregateProduce = async (req, res) => {
  try {
    const { cropName, requirementId, listingIds } = req.body;

    if (!listingIds || listingIds.length === 0) {
      return res.status(400).json({ error: 'Please select at least 2 farmer listings to aggregate.' });
    }

    const listings = await prisma.produceListing.findMany({
      where: { id: { in: listingIds } },
      include: { farmer: { include: { user: true } } }
    });

    const totalAggregatedQty = listings.reduce((sum, l) => sum + l.quantityKg, 0);
    const avgPrice = Math.round((listings.reduce((sum, l) => sum + (l.askingPricePerKg * l.quantityKg), 0) / totalAggregatedQty) * 10) / 10;

    let requirement = null;
    if (requirementId) {
      requirement = await prisma.buyerRequirement.findUnique({ where: { id: requirementId } });
    }

    const aggregationSummary = {
      cropName: cropName || (listings[0] ? listings[0].cropName : 'Aggregated Crop'),
      participatingFarmersCount: listings.length,
      farmersBreakdown: listings.map(l => ({
        farmerName: l.farmer.user.name,
        quantityKg: l.quantityKg,
        askingPricePerKg: l.askingPricePerKg,
        village: l.farmer.user.village || 'Pune Region'
      })),
      totalAggregatedQty,
      weightedAvgPricePerKg: avgPrice,
      isRequirementFulfilled: requirement ? totalAggregatedQty >= requirement.quantityKg : true,
      requirementQty: requirement ? requirement.quantityKg : totalAggregatedQty,
      message: `Requirement fulfilled through aggregation across ${listings.length} member farmers.`
    };

    res.json(aggregationSummary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFPODashboard,
  aggregateProduce
};
