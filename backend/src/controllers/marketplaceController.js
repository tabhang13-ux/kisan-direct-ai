const prisma = require('../utils/prisma');

const getMarketplaceListings = async (req, res) => {
  try {
    const {
      crop, category, location, maxPrice, minQuantity,
      isOrganic, qualityGrade, search
    } = req.query;

    const where = { status: 'AVAILABLE' };

    if (crop) {
      where.cropName = { contains: crop };
    }

    if (category) {
      where.category = category;
    }

    if (location) {
      where.location = { contains: location };
    }

    if (maxPrice) {
      where.askingPricePerKg = { lte: parseFloat(maxPrice) };
    }

    if (minQuantity) {
      where.quantityKg = { gte: parseFloat(minQuantity) };
    }

    if (isOrganic === 'true') {
      where.isOrganic = true;
    }

    if (qualityGrade) {
      where.qualityGrade = qualityGrade;
    }

    if (search) {
      where.OR = [
        { cropName: { contains: search } },
        { location: { contains: search } },
        { category: { contains: search } }
      ];
    }

    const listings = await prisma.produceListing.findMany({
      where,
      include: {
        farmer: { include: { user: true } },
        fpo: { include: { user: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const listing = await prisma.produceListing.findUnique({
      where: { id: req.params.id },
      include: {
        farmer: { include: { user: true } },
        fpo: { include: { user: true } }
      }
    });

    if (!listing) return res.status(404).json({ error: 'Produce listing not found.' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMarketplaceListings,
  getListingById
};
