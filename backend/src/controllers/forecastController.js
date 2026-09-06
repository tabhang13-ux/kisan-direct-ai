const { getDemandForecast, getPriceRecommendation } = require('../services/mlClient');
const prisma = require('../utils/prisma');

const predictCropDemand = async (req, res) => {
  try {
    const { crop, location, supply, previousDemand } = req.body;
    const cropName = crop || 'Tomato';
    const loc = location || 'Pune';

    const forecast = await getDemandForecast(cropName, loc, supply || 13200, previousDemand || 16500);

    // Save forecast to DB history
    await prisma.demandForecast.create({
      data: {
        cropName,
        location: loc,
        predictedDemandKg: forecast.predicted_demand,
        currentSupplyKg: forecast.current_supply,
        demandGapKg: forecast.demand_gap,
        demandLevel: forecast.demand_level,
        confidenceScore: forecast.confidence_score,
        factorsJson: JSON.stringify(forecast.explanations)
      }
    });

    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const recommendListingPrice = async (req, res) => {
  try {
    const { crop, location, quantity, historicalPrice, supply, demand } = req.body;
    const cropName = crop || 'Tomato';
    const loc = location || 'Pune';

    const recommendation = await getPriceRecommendation(
      cropName, loc, quantity || 1500, historicalPrice || 24.0, supply || 12000, demand || 18000
    );

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  predictCropDemand,
  recommendListingPrice
};
