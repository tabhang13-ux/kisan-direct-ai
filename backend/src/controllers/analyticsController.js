const prisma = require('../utils/prisma');

const getDashboardAnalytics = async (req, res) => {
  try {
    const totalFarmers = await prisma.farmerProfile.count();
    const totalFPOs = await prisma.fPOProfile.count();
    const totalBuyers = await prisma.buyerProfile.count();
    const totalOrders = await prisma.order.count();
    
    const produceListings = await prisma.produceListing.findMany();
    const totalProduceMatchedKg = produceListings.reduce((sum, item) => sum + item.quantityKg, 0);

    const orders = await prisma.order.findMany();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    const routes = await prisma.route.findMany();
    const totalDistanceSavedKm = routes.reduce((sum, route) => sum + route.distanceSavedKm, 0);
    const totalCostSaved = routes.reduce((sum, route) => sum + route.costSaved, 0);

    // Compute Supply vs Demand Chart Data
    const forecasts = await prisma.demandForecast.findMany({ take: 14 });
    const cropDemandChart = {};

    for (const f of forecasts) {
      if (!cropDemandChart[f.cropName]) {
        cropDemandChart[f.cropName] = { crop: f.cropName, demand: 0, supply: 0 };
      }
      cropDemandChart[f.cropName].demand += f.predictedDemandKg;
      cropDemandChart[f.cropName].supply += f.currentSupplyKg;
    }

    const supplyVsDemandData = Object.values(cropDemandChart);

    // Farmer Income Realization Comparison (Direct vs Traditional 5-Tier)
    const farmerIncomeBeforeAfter = [
      { crop: 'Tomato', traditionalFarmerPrice: 18.0, kisandirectPrice: 24.0, consumerPrice: 30.0 },
      { crop: 'Onion', traditionalFarmerPrice: 21.0, kisandirectPrice: 28.0, consumerPrice: 34.0 },
      { crop: 'Potato', traditionalFarmerPrice: 14.0, kisandirectPrice: 19.5, consumerPrice: 24.0 },
      { crop: 'Wheat', traditionalFarmerPrice: 26.0, kisandirectPrice: 33.0, consumerPrice: 38.0 },
      { crop: 'Grapes', traditionalFarmerPrice: 62.0, kisandirectPrice: 88.0, consumerPrice: 110.0 }
    ];

    res.json({
      metrics: {
        totalFarmers: totalFarmers || 24,
        totalFPOs: totalFPOs || 3,
        totalBuyers: totalBuyers || 11,
        totalOrders: totalOrders || 18,
        totalProduceMatchedKg: totalProduceMatchedKg || 84500,
        farmerRevenue: totalRevenue || 1845000,
        estimatedBuyerSavings: Math.round(totalRevenue * 0.15) || 276750,
        transportDistanceSavedKm: totalDistanceSavedKm || 1420,
        transportCostSaved: totalCostSaved || 16330,
        farmerIncomeImprovementPct: 33.3
      },
      supplyVsDemandData,
      farmerIncomeBeforeAfter,
      isPrototypeSimulation: true,
      simulationBadge: "PROTOTYPE SIMULATION DATA — SIH DEMO 2026"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardAnalytics
};
