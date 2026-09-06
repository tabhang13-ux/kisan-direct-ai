const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/optimize', routeController.optimizeLogisticsRoute);
router.get('/', authenticate, routeController.getAllRoutes);
router.get('/:id', authenticate, routeController.getRouteById);

module.exports = router;
