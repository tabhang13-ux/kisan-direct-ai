const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const register = async (req, res) => {
  try {
    const {
      name, email, password, phone, role,
      location, state, district, village,
      // Role specific fields
      fpoId, produceTypes, landSizeAcres,
      organizationName, buyerType,
      companyName, serviceArea
    } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required fields.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || '+91 98000 00000',
        role,
        location: location || 'Pune, Maharashtra',
        state: state || 'Maharashtra',
        district: district || 'Pune',
        village: village || ''
      }
    });

    // Create role specific profile
    if (role === 'FARMER') {
      await prisma.farmerProfile.create({
        data: {
          userId: user.id,
          produceTypes: produceTypes || 'Vegetables',
          landSizeAcres: landSizeAcres ? parseFloat(landSizeAcres) : 2.5,
          fpoId: fpoId || null
        }
      });
    } else if (role === 'FPO') {
      await prisma.fPOProfile.create({
        data: {
          userId: user.id,
          fpoName: organizationName || `${name} Farmers Co.`,
          registrationNo: `FPO-MH-${Math.floor(1000 + Math.random() * 9000)}`,
          memberCount: 25
        }
      });
    } else if (role === 'BUYER') {
      await prisma.buyerProfile.create({
        data: {
          userId: user.id,
          organizationName: organizationName || name,
          buyerType: buyerType || 'Supermarket Chain'
        }
      });
    } else if (role === 'LOGISTICS') {
      const logisticsProfile = await prisma.logisticsProfile.create({
        data: {
          userId: user.id,
          companyName: companyName || `${name} Logistics`,
          serviceArea: serviceArea || 'Pune Region'
        }
      });

      // Default vehicle
      await prisma.vehicle.create({
        data: {
          logisticsId: logisticsProfile.id,
          vehicleNumber: `MH-12-${Math.floor(1000 + Math.random() * 9000)}`,
          driverName: name,
          driverPhone: phone || '+91 98000 00000',
          capacityKg: 3000,
          currentLocation: location || 'Pune Hub'
        }
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        farmerProfile: true,
        fpoProfile: true,
        buyerProfile: true,
        logisticsProfile: true
      }
    });

    delete updatedUser.password;

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: updatedUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration: ' + error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        farmerProfile: true,
        fpoProfile: true,
        buyerProfile: true,
        logisticsProfile: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Password incorrect.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    delete user.password;

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login: ' + error.message });
  }
};

const getMe = async (req, res) => {
  try {
    delete req.user.password;
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
