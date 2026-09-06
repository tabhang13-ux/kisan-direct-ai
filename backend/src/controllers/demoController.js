const prisma = require('../utils/prisma');
const { getDemandForecast, getPriceRecommendation, optimizeRoute } = require('../services/mlClient');
const { findMatchedSuppliers } = require('../services/matchingService');

const runSihDemoScenario = async (req, res) => {
  try {
    // Step 1: Farmer Produce Listing
    const demoFarmer = await prisma.user.findFirst({
      where: { email: 'farmer@demo.com' },
      include: { farmerProfile: true }
    });

    const listingData = {
      cropName: 'Tomato',
      quantityKg: 2000,
      askingPricePerKg: 24.0,
      location: 'Manchar Village, Pune',
      latitude: 19.0039,
      longitude: 73.9431
    };

    // Step 2: AI Demand Forecast
    const forecast = await getDemandForecast('Tomato', 'Pune', 13200, 18400);

    // Step 3: AI Price Recommendation
    const priceRec = await getPriceRecommendation('Tomato', 'Pune', 1500, 22.0, 13200, 18400);

    // Step 4: Buyer Requirement Creation
    const demoBuyer = await prisma.user.findFirst({
      where: { email: 'buyer@demo.com' },
      include: { buyerProfile: true }
    });

    const requirementData = {
      cropName: 'Tomato',
      quantityKg: 1500,
      maxPricePerKg: 27.0,
      deliveryLocation: 'Hadapsar Wholesale Hub, Pune',
      latitude: 18.5089,
      longitude: 73.9260
    };

    // Step 5: Smart Supplier Matching & Multi-Farmer Aggregation
    const existingReq = await prisma.buyerRequirement.findFirst({ where: { cropName: 'Tomato' } });
    const matchResults = existingReq ? await findMatchedSuppliers(existingReq.id) : {
      rankedMatches: [
        { supplierName: 'Pune Sahakari FPO Central', matchScore: 94, availableQuantityKg: 2000, askingPricePerKg: 23.0, distanceKm: 18.5 },
        { supplierName: 'Ramesh Kulkarni (Demo Farmer)', matchScore: 87, availableQuantityKg: 400, askingPricePerKg: 24.0, distanceKm: 24.0 },
        { supplierName: 'Subhash Kadam (Farmer B)', matchScore: 81, availableQuantityKg: 300, askingPricePerKg: 24.0, distanceKm: 26.5 }
      ],
      aggregationStatus: {
        isAggregated: true,
        totalFulfilledQtyKg: 1500,
        fulfillmentPct: 100,
        participatingSuppliers: [
          { supplierName: 'Farmer A (Manchar)', contributedQtyKg: 400, pricePerKg: 24.0 },
          { supplierName: 'Farmer B (Khed)', contributedQtyKg: 300, pricePerKg: 24.0 },
          { supplierName: 'Farmer C (Junnar)', contributedQtyKg: 300, pricePerKg: 24.0 },
          { supplierName: 'FPO Buffer Hub', contributedQtyKg: 500, pricePerKg: 23.0 }
        ],
        message: 'Requirement fulfilled through FPO multi-farmer supply aggregation.'
      }
    };

    // Step 6: Route Optimization
    const pickupPoints = [
      { name: 'Farmer A (Manchar Farm)', lat: 19.0039, lng: 73.9431, quantity_kg: 400 },
      { name: 'Farmer B (Khed Farm)', lat: 18.8475, lng: 73.9105, quantity_kg: 300 },
      { name: 'Farmer C (Junnar Farm)', lat: 19.2064, lng: 73.8762, quantity_kg: 300 },
      { name: 'Pune FPO Collection Hub', lat: 18.7606, lng: 73.8596, quantity_kg: 500 }
    ];

    const deliveryPoint = {
      name: 'FreshBasket Hadapsar Depot (Buyer)',
      lat: 18.5089,
      lng: 73.9260
    };

    const routeOptimization = await optimizeRoute(pickupPoints, deliveryPoint, 3500);

    // Step 7: Transparent Price Breakdown
    const priceBreakdown = {
      buyerPaysPerKg: 30.0,
      logisticsAndPlatformPerKg: 3.0,
      farmerReceivesPerKg: 27.0,
      traditionalComparison: {
        traditionalFarmer: 18.0,
        traderCommission: 3.0,
        wholesalerMargin: 3.0,
        retailerMargin: 6.0,
        traditionalConsumerPrice: 30.0
      },
      farmerGainPct: 50.0,
      consumerSavingsPct: 0.0
    };

    // Timeline steps for UI rendering
    const timelineSteps = [
      { step: 1, title: 'Farmer Supply Listed', status: 'COMPLETED', detail: 'Farmer listed 2,000 kg Tomato at ₹24/kg in Manchar.' },
      { step: 2, title: 'AI Demand Forecast', status: 'COMPLETED', detail: 'FastAPI ML predicted HIGH demand (18,400 kg) with 5,200 kg regional gap.' },
      { step: 3, title: 'AI Price Recommendation', status: 'COMPLETED', detail: 'Recommended price: ₹24/kg (Market range ₹21–₹25/kg).' },
      { step: 4, title: 'Buyer Requirement Posted', status: 'COMPLETED', detail: 'Supermarket posted 1,500 kg requirement at max ₹27/kg.' },
      { step: 5, title: 'Smart Supplier Matching & Aggregation', status: 'COMPLETED', detail: 'Engine matched FPO + 3 Farmers. Aggregated 1,500 kg total supply.' },
      { step: 6, title: 'OR-Tools Route Optimization', status: 'COMPLETED', detail: `CVRP solver generated 4-pickup route saving ${routeOptimization.distance_saved_km} km & ₹${routeOptimization.estimated_cost_saved}.` },
      { step: 7, title: 'Order Confirmed & Shipment Dispatched', status: 'COMPLETED', detail: 'Order #ORD-26033 confirmed. Vehicle MH-12-QX-4012 assigned.' },
      { step: 8, title: 'Impact Realized', status: 'COMPLETED', detail: 'Farmer income +50% higher than traditional mandi (₹27 vs ₹18/kg).' }
    ];

    res.json({
      scenarioName: 'SIH 2026 Problem 26033 - Complete End-to-End Demo',
      farmer: demoFarmer,
      buyer: demoBuyer,
      listing: listingData,
      forecast,
      priceRecommendation: priceRec,
      requirement: requirementData,
      matchResults,
      routeOptimization,
      priceBreakdown,
      timelineSteps
    });
  } catch (error) {
    console.error('Demo scenario error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  runSihDemoScenario
};
