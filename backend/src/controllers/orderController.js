const prisma = require('../utils/prisma');
const { optimizeRoute } = require('../services/mlClient');

const createOrder = async (req, res) => {
  try {
    const { buyerId, requirementId, listingIds, quantities, deliveryLocation } = req.body;

    const buyer = req.user.buyerProfile || await prisma.buyerProfile.findFirst({ where: { id: buyerId } });
    if (!buyer) {
      return res.status(400).json({ error: 'Valid buyer profile required.' });
    }

    if (!listingIds || listingIds.length === 0) {
      return res.status(400).json({ error: 'Please select at least one produce listing to order.' });
    }

    const listings = await prisma.produceListing.findMany({
      where: { id: { in: listingIds } },
      include: { farmer: { include: { user: true } }, fpo: { include: { user: true } } }
    });

    let totalQuantityKg = 0;
    let totalPrice = 0;
    const orderItemsData = [];
    const pickupPoints = [];

    for (let i = 0; i < listings.length; i++) {
      const l = listings[i];
      const qty = quantities && quantities[l.id] ? parseFloat(quantities[l.id]) : l.quantityKg;
      const itemTotal = qty * l.askingPricePerKg;

      totalQuantityKg += qty;
      totalPrice += itemTotal;

      orderItemsData.push({
        listingId: l.id,
        farmerId: l.farmerId,
        quantityKg: qty,
        pricePerKg: l.askingPricePerKg
      });

      pickupPoints.push({
        name: `${l.farmer.user.name} (${l.cropName})`,
        lat: l.latitude || 18.8475,
        lng: l.longitude || 73.9105,
        quantity_kg: qty
      });

      // Mark listing as RESERVED or SOLD
      await prisma.produceListing.update({
        where: { id: l.id },
        data: { status: 'RESERVED' }
      });
    }

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        buyerId: buyer.id,
        requirementId: requirementId || null,
        totalQuantityKg,
        totalPrice,
        status: 'CONFIRMED',
        deliveryLocation: deliveryLocation || buyer.user.location || 'Pune Depot',
        latitude: buyer.user.latitude || 18.5204,
        longitude: buyer.user.longitude || 73.8567,
        orderItems: { create: orderItemsData },
        transactions: {
          create: {
            buyerPaid: totalPrice,
            platformFee: totalPrice * 0.05,
            farmerReceived: totalPrice * 0.95,
            status: 'COMPLETED'
          }
        }
      },
      include: {
        orderItems: { include: { listing: true } },
        transactions: true
      }
    });

    // Auto-create Route using Route Optimizer
    const deliveryPoint = {
      name: `${buyer.organizationName} Depot`,
      lat: buyer.user.latitude || 18.5204,
      lng: buyer.user.longitude || 73.8567
    };

    const routeOptimizationResult = await optimizeRoute(pickupPoints, deliveryPoint, 4000);
    const assignedVehicle = await prisma.vehicle.findFirst({ where: { isAvailable: true } });

    const routeRecord = await prisma.route.create({
      data: {
        orderId: order.id,
        vehicleId: assignedVehicle ? assignedVehicle.id : null,
        totalDistanceKm: routeOptimizationResult.total_distance_km,
        estimatedTimeMinutes: routeOptimizationResult.estimated_time_minutes,
        estimatedFuelCost: routeOptimizationResult.estimated_fuel_cost,
        distanceSavedKm: routeOptimizationResult.distance_saved_km,
        costSaved: routeOptimizationResult.estimated_cost_saved,
        status: 'ASSIGNED',
        waypointsJson: JSON.stringify(routeOptimizationResult.route_waypoints)
      }
    });

    // Send System Notification
    await prisma.notification.create({
      data: {
        userId: buyer.userId,
        title: 'Order Confirmed & Dispatching',
        message: `Order #${order.id.slice(0, 8)} confirmed for ${totalQuantityKg} kg. Optimized route generated (${routeOptimizationResult.distance_saved_km} km saved).`,
        type: 'ORDER'
      }
    });

    res.status(201).json({
      order,
      route: routeRecord,
      optimizationDetails: routeOptimizationResult
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const user = req.user;
    let where = {};

    if (user.role === 'BUYER' && user.buyerProfile) {
      where.buyerId = user.buyerProfile.id;
    } else if (user.role === 'FARMER' && user.farmerProfile) {
      where.orderItems = { some: { farmerId: user.farmerProfile.id } };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        buyer: { include: { user: true } },
        orderItems: { include: { listing: { include: { farmer: { include: { user: true } } } } } },
        routes: { include: { vehicle: true } },
        transactions: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        buyer: { include: { user: true } },
        orderItems: { include: { listing: { include: { farmer: { include: { user: true } } } } } },
        routes: { include: { vehicle: true } },
        transactions: true
      }
    });

    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { buyer: { include: { user: true } } }
    });

    // Update matching route status
    await prisma.route.updateMany({
      where: { orderId: id },
      data: { status }
    });

    await prisma.notification.create({
      data: {
        userId: order.buyer.userId,
        title: `Order Status Updated: ${status}`,
        message: `Your order #${id.slice(0, 8)} status changed to ${status}.`,
        type: 'LOGISTICS'
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
