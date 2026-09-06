const prisma = require('../utils/prisma');
const { optimizeRoute } = require('../services/mlClient');

const optimizeLogisticsRoute = async (req, res) => {
  try {
    const { pickupPoints, deliveryPoint, vehicleCapacityKg } = req.body;

    if (!pickupPoints || pickupPoints.length === 0 || !deliveryPoint) {
      return res.status(400).json({ error: 'Pickup points array and delivery point object are required.' });
    }

    const optimization = await optimizeRoute(pickupPoints, deliveryPoint, vehicleCapacityKg || 3500);

    res.json(optimization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllRoutes = async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      include: {
        order: { include: { buyer: { include: { user: true } } } },
        vehicle: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const vehicles = await prisma.vehicle.findMany({
      include: { logistics: { include: { user: true } } }
    });

    res.json({ routes, vehicles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRouteById = async (req, res) => {
  try {
    const route = await prisma.route.findUnique({
      where: { id: req.params.id },
      include: {
        order: { include: { buyer: { include: { user: true } }, orderItems: { include: { listing: true } } } },
        vehicle: true
      }
    });

    if (!route) return res.status(404).json({ error: 'Route not found.' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  optimizeLogisticsRoute,
  getAllRoutes,
  getRouteById
};
