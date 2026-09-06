const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const fpoRoutes = require('./routes/fpoRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const orderRoutes = require('./routes/orderRoutes');
const routeRoutes = require('./routes/routeRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const demoRoutes = require('./routes/demoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Route mounts
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/fpo', fpoRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/demo', demoRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'KisanDirect AI Backend REST API',
    problemStatement: '26033 - Department of Consumer Affairs (DoCA)',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({ error: 'Internal Server Error: ' + err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 KisanDirect AI Express REST API listening on port ${PORT}`);
});
