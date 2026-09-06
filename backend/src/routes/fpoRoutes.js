const express = require('express');
const router = express.Router();
const fpoController = require('../controllers/fpoController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', authenticate, authorize(['FPO', 'ADMIN']), fpoController.getFPODashboard);
router.post('/aggregate', authenticate, authorize(['FPO', 'ADMIN']), fpoController.aggregateProduce);

module.exports = router;
