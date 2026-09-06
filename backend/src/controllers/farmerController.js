const prisma = require('../utils/prisma');
const { getDemandForecast, getPriceRecommendation } = require('../services/mlClient');

const getAllFarmers = async (req, res) => {
  try {
    const farmers = await prisma.farmerProfile.findMany({
      include: {
        user: true,
        fpo: true,
        listings: true
      }
    });
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFarmerById = async (req, res) => {
  try {
    const farmer = await prisma.farmerProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        fpo: true,
        listings: true
      }
    });
    if (!farmer) return res.status(404).json({ error: 'Farmer profile not found.' });
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyProduce = async (req, res) => {
  try {
    const farmerProfile = req.user.farmerProfile;
    if (!farmerProfile) {
      return res.status(400).json({ error: 'User does not have a farmer profile.' });
    }

    const listings = await prisma.produceListing.findMany({
      where: { farmerId: farmerProfile.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addProduce = async (req, res) => {
  try {
    const farmerProfile = req.user.farmerProfile;
    if (!farmerProfile) {
      return res.status(400).json({ error: 'Only farmers can add produce listings.' });
    }

    const {
      cropName, category, quantityKg, askingPricePerKg, minPricePerKg,
      harvestDate, qualityGrade, isOrganic, location, imageUrl
    } = req.body;

    if (!cropName || !quantityKg || !askingPricePerKg) {
      return res.status(400).json({ error: 'Crop name, quantity (kg), and asking price per kg are required.' });
    }

    const listing = await prisma.produceListing.create({
      data: {
        farmerId: farmerProfile.id,
        fpoId: farmerProfile.fpoId || null,
        cropName,
        category: category || 'Vegetables',
        quantityKg: parseFloat(quantityKg),
        askingPricePerKg: parseFloat(askingPricePerKg),
        minPricePerKg: minPricePerKg ? parseFloat(minPricePerKg) : parseFloat(askingPricePerKg) * 0.9,
        harvestDate: harvestDate || new Date().toISOString().split('T')[0],
        qualityGrade: qualityGrade || 'GRADE_A',
        isOrganic: isOrganic === true || isOrganic === 'true',
        location: location || req.user.location || 'Pune District',
        latitude: req.user.latitude || 18.5204,
        longitude: req.user.longitude || 73.8567,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'
      }
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        title: 'Produce Listed Successfully',
        message: `${quantityKg} kg of ${cropName} listed at ₹${askingPricePerKg}/kg.`,
        type: 'INFO'
      }
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduce = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await prisma.produceListing.findUnique({ where: { id } });
    if (!listing) return res.status(404).json({ error: 'Listing not found.' });

    const updated = await prisma.produceListing.update({
      where: { id },
      data: {
        ...req.body,
        quantityKg: req.body.quantityKg ? parseFloat(req.body.quantityKg) : listing.quantityKg,
        askingPricePerKg: req.body.askingPricePerKg ? parseFloat(req.body.askingPricePerKg) : listing.askingPricePerKg
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduce = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.produceListing.delete({ where: { id } });
    res.json({ message: 'Produce listing removed successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllFarmers,
  getFarmerById,
  getMyProduce,
  addProduce,
  updateProduce,
  deleteProduce
};
