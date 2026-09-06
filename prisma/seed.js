const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KisanDirect AI Database Seeding...');

  // Clean existing tables
  await prisma.transaction.deleteMany();
  await prisma.route.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.supplierMatch.deleteMany();
  await prisma.buyerRequirement.deleteMany();
  await prisma.produceListing.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.logisticsProfile.deleteMany();
  await prisma.buyerProfile.deleteMany();
  await prisma.fPOProfile.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.demandForecast.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Products Catalog
  const products = [
    { name: 'Tomato', category: 'Vegetables', avgMarketPrice: 28.0, imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500' },
    { name: 'Onion', category: 'Vegetables', avgMarketPrice: 32.0, imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500' },
    { name: 'Potato', category: 'Vegetables', avgMarketPrice: 22.0, imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500' },
    { name: 'Wheat', category: 'Grains', avgMarketPrice: 35.0, imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500' },
    { name: 'Rice (Basmati)', category: 'Grains', avgMarketPrice: 85.0, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
    { name: 'Maize', category: 'Grains', avgMarketPrice: 24.0, imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500' },
    { name: 'Cotton', category: 'Cash Crops', avgMarketPrice: 72.0, imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500' },
    { name: 'Soybean', category: 'Cash Crops', avgMarketPrice: 48.0, imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c03d?w=500' },
    { name: 'Grapes', category: 'Fruits', avgMarketPrice: 90.0, imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500' },
    { name: 'Pomegranate', category: 'Fruits', avgMarketPrice: 130.0, imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500' }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  // 2. Create Core Demo Accounts
  // ADMIN
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Rajesh Sharma (DoCA Officer)',
      email: 'admin@demo.com',
      password: defaultPasswordHash,
      phone: '+91 98220 11001',
      role: 'ADMIN',
      location: 'DoCA Krishi Bhawan, New Delhi / Pune HQ',
      state: 'Maharashtra',
      district: 'Pune'
    }
  });

  // FPO 1
  const fpoUser1 = await prisma.user.create({
    data: {
      name: 'Suresh Patil (Pune FPO Manager)',
      email: 'fpo@demo.com',
      password: defaultPasswordHash,
      phone: '+91 98220 22002',
      role: 'FPO',
      location: 'Khed Hub, Pune',
      state: 'Maharashtra',
      district: 'Pune',
      latitude: 18.8475,
      longitude: 73.9105,
      fpoProfile: {
        create: {
          fpoName: 'Pune Sahakari Krishi Producer Co.',
          registrationNo: 'FPO-MH-PUN-2023-089',
          memberCount: 45
        }
      }
    },
    include: { fpoProfile: true }
  });

  // FPO 2 & 3
  const fpoUser2 = await prisma.user.create({
    data: {
      name: 'Rameshwar Taware',
      email: 'fpo2@demo.com',
      password: defaultPasswordHash,
      phone: '+91 98220 22003',
      role: 'FPO',
      location: 'Junnar Hub, Pune',
      state: 'Maharashtra',
      district: 'Pune',
      latitude: 19.2064,
      longitude: 73.8762,
      fpoProfile: {
        create: {
          fpoName: 'Junnar Valley Agro Farmers Producer Ltd',
          registrationNo: 'FPO-MH-JUN-2022-041',
          memberCount: 68
        }
      }
    },
    include: { fpoProfile: true }
  });

  const fpoUser3 = await prisma.user.create({
    data: {
      name: 'Anand Kakade',
      email: 'fpo3@demo.com',
      password: defaultPasswordHash,
      phone: '+91 98220 22004',
      role: 'FPO',
      location: 'Baramati Hub, Pune',
      state: 'Maharashtra',
      district: 'Pune',
      latitude: 18.1517,
      longitude: 74.577,
      fpoProfile: {
        create: {
          fpoName: 'Baramati Green Producers Union',
          registrationNo: 'FPO-MH-BAR-2024-102',
          memberCount: 32
        }
      }
    },
    include: { fpoProfile: true }
  });

  // DEMO FARMER
  const demoFarmerUser = await prisma.user.create({
    data: {
      name: 'Ramesh Kulkarni',
      email: 'farmer@demo.com',
      password: defaultPasswordHash,
      phone: '+91 98220 33003',
      role: 'FARMER',
      location: 'Manchar Village, Ambegaon',
      state: 'Maharashtra',
      district: 'Pune',
      village: 'Manchar',
      latitude: 19.0039,
      longitude: 73.9431,
      farmerProfile: {
        create: {
          produceTypes: 'Tomato, Potato, Onion',
          landSizeAcres: 4.5,
          fpoId: fpoUser1.fpoProfile.id
        }
      }
    },
    include: { farmerProfile: true }
  });

  // DEMO BUYER
  const demoBuyerUser = await prisma.user.create({
    data: {
      name: 'Vikram Mehta (Procurement Lead)',
      email: 'buyer@demo.com',
      password: defaultPasswordHash,
      phone: '+91 98220 44004',
      role: 'BUYER',
      location: 'Hadapsar Wholesale Hub, Pune',
      state: 'Maharashtra',
      district: 'Pune',
      latitude: 18.5089,
      longitude: 73.926,
      buyerProfile: {
        create: {
          organizationName: 'FreshBasket Supermarkets India',
          buyerType: 'Supermarket Chain'
        }
      }
    },
    include: { buyerProfile: true }
  });

  // DEMO LOGISTICS
  const demoLogisticsUser = await prisma.user.create({
    data: {
      name: 'Manoj Transport & Express Logistics',
      email: 'logistics@demo.com',
      password: defaultPasswordHash,
      phone: '+91 98220 55005',
      role: 'LOGISTICS',
      location: 'Bhosari Transport Nagar, Pune',
      state: 'Maharashtra',
      district: 'Pune',
      latitude: 18.6277,
      longitude: 73.8427,
      logisticsProfile: {
        create: {
          companyName: 'KisanDirect Express Logistics',
          serviceArea: 'Pune Metropolitan Region & Western Maharashtra'
        }
      }
    },
    include: { logisticsProfile: true }
  });

  // 3. Seed 20+ Farmers
  const farmerNames = [
    { name: 'Balasaheb Shinde', village: 'Khed', crop: 'Tomato', lat: 18.8475, lng: 73.9105 },
    { name: 'Ganpat Rao Pawar', village: 'Junnar', crop: 'Onion', lat: 19.2064, lng: 73.8762 },
    { name: 'Eknath Jadhav', village: 'Baramati', crop: 'Grapes', lat: 18.1517, lng: 74.577 },
    { name: 'Santosh Thorat', village: 'Shirur', crop: 'Wheat', lat: 18.8288, lng: 74.3789 },
    { name: 'Tukaram Deshmukh', village: 'Indapur', crop: 'Soybean', lat: 18.1186, lng: 75.0341 },
    { name: 'Subhash Kadam', village: 'Manchar', crop: 'Tomato', lat: 19.0039, lng: 73.9431 },
    { name: 'Pandurang Bhosale', village: 'Talegaon', crop: 'Potato', lat: 18.7303, lng: 73.6756 },
    { name: 'Vithal Shelke', village: 'Phaltan', crop: 'Pomegranate', lat: 17.9866, lng: 74.4287 },
    { name: 'Nitin Chaudhari', village: 'Purandar', crop: 'Maize', lat: 18.2811, lng: 73.9621 },
    { name: 'Ashok Gaikwad', village: 'Daund', crop: 'Cotton', lat: 18.4632, lng: 74.5937 },
    { name: 'Vishwas Wagh', village: 'Bhor', crop: 'Rice (Basmati)', lat: 18.1472, lng: 73.8459 },
    { name: 'Sanjay More', village: 'Velhe', crop: 'Vegetables', lat: 18.2974, lng: 73.6367 },
    { name: 'Dnyaneshwar Mankar', village: 'Rajgurunagar', crop: 'Tomato', lat: 18.8576, lng: 73.8824 },
    { name: 'Popat Bandal', village: 'Narayangaon', crop: 'Tomato', lat: 19.1171, lng: 73.9745 },
    { name: 'Suresh Ghode', village: 'Ozar', crop: 'Grapes', lat: 19.1824, lng: 73.9485 },
    { name: 'Babanrao Bankar', village: 'Alephata', crop: 'Onion', lat: 19.1627, lng: 74.1084 },
    { name: 'Uttam Zinjurde', village: 'Chakan', crop: 'Potato', lat: 18.7606, lng: 73.8596 },
    { name: 'Raghunath Dhamdhere', village: 'Shikrapur', crop: 'Wheat', lat: 18.6834, lng: 74.1293 },
    { name: 'Machhindra Landge', village: 'Bhosari Agro', crop: 'Vegetables', lat: 18.6277, lng: 73.8427 }
  ];

  const farmerProfiles = [demoFarmerUser.farmerProfile];

  for (let i = 0; i < farmerNames.length; i++) {
    const f = farmerNames[i];
    const u = await prisma.user.create({
      data: {
        name: f.name,
        email: `farmer_${i + 1}@kisandirect.in`,
        password: defaultPasswordHash,
        phone: `+91 98220 ${60000 + i}`,
        role: 'FARMER',
        location: `${f.village}, Pune`,
        state: 'Maharashtra',
        district: 'Pune',
        village: f.village,
        latitude: f.lat,
        longitude: f.lng,
        farmerProfile: {
          create: {
            produceTypes: f.crop,
            landSizeAcres: 2.0 + (i % 5) * 1.5,
            fpoId: i % 2 === 0 ? fpoUser1.fpoProfile.id : fpoUser2.fpoProfile.id
          }
        }
      },
      include: { farmerProfile: true }
    });
    farmerProfiles.push(u.farmerProfile);
  }

  // 4. Seed 10+ Buyers
  const buyersList = [
    { name: 'BigBasket Fulfillment Hub', email: 'procurement@bigbasket.com', type: 'Supermarket Chain', lat: 18.5204, lng: 73.8567 },
    { name: 'Metro Cash & Carry Pune', email: 'bulk@metrocash.in', type: 'Wholesaler', lat: 18.5089, lng: 73.9260 },
    { name: 'Sahyadri Retail Markets', email: 'orders@sahyadri.com', type: 'Supermarket Chain', lat: 18.5590, lng: 73.7868 },
    { name: 'Hotel JW Marriott Kitchens', email: 'chef@marriottpune.com', type: 'Hotel & Hospitality', lat: 18.5332, lng: 73.8298 },
    { name: 'GreenFresh Wholesalers', email: 'mandi@greenfresh.in', type: 'Wholesaler', lat: 18.4975, lng: 73.8640 },
    { name: 'Reliance Smart Superstore', email: 'agri@reliancesmart.in', type: 'Retailer', lat: 18.5912, lng: 73.7389 },
    { name: 'Star Bazaar Wakad', email: 'procure@starbazaar.com', type: 'Supermarket Chain', lat: 18.5987, lng: 73.7634 },
    { name: 'Sayaji Hotels Pune', email: 'kitchen@sayajihotels.com', type: 'Hotel & Hospitality', lat: 18.5946, lng: 73.7589 },
    { name: 'Mother Dairy Safal Depot', email: 'supply@safal.in', type: 'Institutional Buyer', lat: 18.5012, lng: 73.8123 },
    { name: 'Zomato Hyperpure Processing', email: 'hyperpure@zomato.com', type: 'B2B Foodtech', lat: 18.5411, lng: 73.9012 }
  ];

  const buyerProfiles = [demoBuyerUser.buyerProfile];

  for (let i = 0; i < buyersList.length; i++) {
    const b = buyersList[i];
    const u = await prisma.user.create({
      data: {
        name: b.name,
        email: b.email,
        password: defaultPasswordHash,
        phone: `+91 98220 ${70000 + i}`,
        role: 'BUYER',
        location: `${b.name}, Pune`,
        state: 'Maharashtra',
        district: 'Pune',
        latitude: b.lat,
        longitude: b.lng,
        buyerProfile: {
          create: {
            organizationName: b.name,
            buyerType: b.type
          }
        }
      },
      include: { buyerProfile: true }
    });
    buyerProfiles.push(u.buyerProfile);
  }

  // 5. Seed Vehicles for Logistics Profile
  const vehiclesData = [
    { vehicleNumber: 'MH-12-QX-4012', driverName: 'Shivaji Mane', driverPhone: '+91 98220 90001', capacityKg: 2500, currentLocation: 'Chakan Hub' },
    { vehicleNumber: 'MH-12-VT-8819', driverName: 'Deepak Shinde', driverPhone: '+91 98220 90002', capacityKg: 3500, currentLocation: 'Narayangaon Hub' },
    { vehicleNumber: 'MH-14-GH-1290', driverName: 'Amol Borade', driverPhone: '+91 98220 90003', capacityKg: 1500, currentLocation: 'Hadapsar Hub' },
    { vehicleNumber: 'MH-12-RT-6712', driverName: 'Sunil Jadhav', driverPhone: '+91 98220 90004', capacityKg: 5000, currentLocation: 'Manchar Hub' },
    { vehicleNumber: 'MH-12-PL-3310', driverName: 'Ganesh Shelke', driverPhone: '+91 98220 90005', capacityKg: 2000, currentLocation: 'Junnar Hub' },
    { vehicleNumber: 'MH-14-ZX-5541', driverName: 'Rahul Sawant', driverPhone: '+91 98220 90006', capacityKg: 4000, currentLocation: 'Baramati Hub' },
    { vehicleNumber: 'MH-12-KP-9901', driverName: 'Pandurang Kale', driverPhone: '+91 98220 90007', capacityKg: 1800, currentLocation: 'Khed Hub' },
    { vehicleNumber: 'MH-12-BN-2234', driverName: 'Vikas Kadam', driverPhone: '+91 98220 90008', capacityKg: 3000, currentLocation: 'Chakan Depot' },
    { vehicleNumber: 'MH-14-EE-7712', driverName: 'Sanjay Thorat', driverPhone: '+91 98220 90009', capacityKg: 6000, currentLocation: 'Bhosari Fleet Hub' },
    { vehicleNumber: 'MH-12-LL-1092', driverName: 'Sachin Patil', driverPhone: '+91 98220 90010', capacityKg: 2500, currentLocation: 'Shirur Depot' }
  ];

  for (const v of vehiclesData) {
    await prisma.vehicle.create({
      data: {
        ...v,
        logisticsId: demoLogisticsUser.logisticsProfile.id
      }
    });
  }

  // 6. Seed 50+ Produce Listings
  const crops = [
    { name: 'Tomato', category: 'Vegetables', priceRange: [22, 26], img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500' },
    { name: 'Onion', category: 'Vegetables', priceRange: [28, 32], img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500' },
    { name: 'Potato', category: 'Vegetables', priceRange: [18, 22], img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500' },
    { name: 'Wheat', category: 'Grains', priceRange: [32, 36], img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500' },
    { name: 'Rice (Basmati)', category: 'Grains', priceRange: [80, 92], img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
    { name: 'Grapes', category: 'Fruits', priceRange: [85, 105], img: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500' },
    { name: 'Pomegranate', category: 'Fruits', priceRange: [120, 140], img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500' },
    { name: 'Soybean', category: 'Cash Crops', priceRange: [45, 52], img: 'https://images.unsplash.com/photo-1599599810694-b5b37304c03d?w=500' }
  ];

  const createdListings = [];

  for (let i = 0; i < 55; i++) {
    const farmer = farmerProfiles[i % farmerProfiles.length];
    const crop = crops[i % crops.length];
    const price = Math.floor(crop.priceRange[0] + Math.random() * (crop.priceRange[1] - crop.priceRange[0]));
    const qty = Math.floor(300 + Math.random() * 2500);

    const listing = await prisma.produceListing.create({
      data: {
        farmerId: farmer.id,
        fpoId: farmer.fpoId || fpoUser1.fpoProfile.id,
        cropName: crop.name,
        category: crop.category,
        quantityKg: qty,
        askingPricePerKg: price,
        minPricePerKg: Math.floor(price * 0.9),
        harvestDate: `2026-09-${10 + (i % 15)}`,
        qualityGrade: i % 4 === 0 ? 'ORGANIC_PREMIUM' : i % 3 === 0 ? 'GRADE_A' : 'GRADE_B',
        isOrganic: i % 4 === 0,
        location: `Mandi ${i % 10 + 1}, Pune District`,
        latitude: 18.5 + (Math.random() - 0.5) * 0.8,
        longitude: 73.8 + (Math.random() - 0.5) * 0.8,
        status: i % 6 === 0 ? 'RESERVED' : 'AVAILABLE',
        imageUrl: crop.img
      }
    });
    createdListings.push(listing);
  }

  // 7. Seed 20+ Buyer Requirements
  const createdRequirements = [];
  for (let i = 0; i < 22; i++) {
    const buyer = buyerProfiles[i % buyerProfiles.length];
    const crop = crops[i % crops.length];

    const req = await prisma.buyerRequirement.create({
      data: {
        buyerId: buyer.id,
        cropName: crop.name,
        quantityKg: 800 + Math.floor(Math.random() * 3000),
        maxPricePerKg: crop.priceRange[1] + 2,
        requiredByDate: `2026-09-${12 + (i % 10)}`,
        deliveryLocation: `${buyer.organizationName} Depot, Pune`,
        latitude: 18.5204 + (Math.random() - 0.5) * 0.3,
        longitude: 73.8567 + (Math.random() - 0.5) * 0.3,
        status: i % 3 === 0 ? 'MATCHED' : 'OPEN'
      }
    });
    createdRequirements.push(req);
  }

  // 8. Seed Sample Demand Forecast Records
  const demandLocations = ['Pune Central', 'Narayangaon', 'Chakan', 'Baramati', 'Hadapsar', 'Manchar', 'Junnar'];
  for (const crop of crops) {
    for (const loc of demandLocations) {
      const predDemand = Math.floor(12000 + Math.random() * 15000);
      const currSupply = Math.floor(8000 + Math.random() * 12000);
      const gap = predDemand - currSupply;
      await prisma.demandForecast.create({
        data: {
          cropName: crop.name,
          location: loc,
          predictedDemandKg: predDemand,
          currentSupplyKg: currSupply,
          demandGapKg: gap,
          demandLevel: gap > 3000 ? 'HIGH' : gap > 0 ? 'MEDIUM' : 'LOW',
          confidenceScore: 0.88 + Math.random() * 0.08,
          factorsJson: JSON.stringify({
            historicalTrend: '+16% demand rise past 14 days',
            seasonalIndex: 'Festival season peak surge',
            supplyDeficit: `${gap} kg regional gap`,
            weatherImpact: 'Optimal harvesting temperature 28°C'
          })
        }
      });
    }
  }

  // 9. Seed Sample Orders and Transactions for Admin Analytics
  const firstReq = createdRequirements[0];
  const sampleOrder = await prisma.order.create({
    data: {
      buyerId: demoBuyerUser.buyerProfile.id,
      requirementId: firstReq.id,
      totalQuantityKg: 1500,
      totalPrice: 1500 * 24.0, // ₹36,000
      status: 'DELIVERED',
      deliveryLocation: 'Hadapsar Wholesale Hub, Pune',
      latitude: 18.5089,
      longitude: 73.926,
      orderItems: {
        create: [
          {
            listingId: createdListings[0].id,
            farmerId: demoFarmerUser.farmerProfile.id,
            quantityKg: 1500,
            pricePerKg: 24.0
          }
        ]
      },
      transactions: {
        create: {
          buyerPaid: 45000,
          platformFee: 4500,
          farmerReceived: 40500,
          status: 'COMPLETED'
        }
      },
      routes: {
        create: {
          vehicleId: (await prisma.vehicle.findFirst()).id,
          totalDistanceKm: 42.5,
          estimatedTimeMinutes: 75,
          estimatedFuelCost: 480.0,
          distanceSavedKm: 28.0,
          costSaved: 350.0,
          status: 'DELIVERED',
          waypointsJson: JSON.stringify([
            { name: 'Manchar Farm Hub (Pickup)', lat: 19.0039, lng: 73.9431 },
            { name: 'Khed FPO Hub (Aggregation)', lat: 18.8475, lng: 73.9105 },
            { name: 'Hadapsar Supermarket Depot (Delivery)', lat: 18.5089, lng: 73.926 }
          ])
        }
      }
    }
  });

  // 10. Seed System Notifications
  const sampleNotifications = [
    { userId: demoFarmerUser.id, title: 'HIGH Demand Alert', message: 'High demand predicted for Tomato in Pune. Recommended price: ₹24/kg', type: 'DEMAND' },
    { userId: demoFarmerUser.id, title: 'Order Matched!', message: 'Buyer FreshBasket matched for 1,500 kg Tomato at ₹24/kg.', type: 'ORDER' },
    { userId: demoBuyerUser.id, title: 'Requirement Fulfilled', message: 'Your requirement of 1,500 kg Tomato fulfilled via Pune FPO Aggregation.', type: 'ORDER' },
    { userId: demoLogisticsUser.id, title: 'New Route Assigned', message: 'Optimized pickup & delivery route assigned for Order #ORD-26033.', type: 'LOGISTICS' }
  ];

  for (const n of sampleNotifications) {
    await prisma.notification.create({ data: n });
  }

  console.log('✅ KisanDirect AI Database Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
