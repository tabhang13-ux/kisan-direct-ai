const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.post('/requirements', authenticate, authorize(['BUYER', 'ADMIN']), buyerController.createRequirement);
router.get('/requirements', authenticate, buyerController.getRequirements);

module.exports = router;
