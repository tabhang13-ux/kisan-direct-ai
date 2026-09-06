const { findMatchedSuppliers } = require('../services/matchingService');
const prisma = require('../utils/prisma');

const findMatches = async (req, res) => {
  try {
    const { requirementId, cropName, quantityKg, maxPricePerKg, location } = req.body;

    let reqId = requirementId;

    // If no requirement ID passed, temporarily mock or create one
    if (!reqId) {
      const defaultBuyer = await prisma.buyerProfile.findFirst();
      const newReq = await prisma.buyerRequirement.create({
        data: {
          buyerId: defaultBuyer.id,
          cropName: cropName || 'Tomato',
          quantityKg: parseFloat(quantityKg) || 1500,
          maxPricePerKg: parseFloat(maxPricePerKg) || 27.0,
          requiredByDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
          deliveryLocation: location || 'Pune Depot',
          latitude: 18.5204,
          longitude: 73.8567
        }
      });
      reqId = newReq.id;
    }

    const matches = await findMatchedSuppliers(reqId);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  findMatches
};
