const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', farmerController.getAllFarmers);
router.get('/produce', authenticate, farmerController.getMyProduce);
router.post('/produce', authenticate, authorize(['FARMER', 'FPO', 'ADMIN']), farmerController.addProduce);
router.put('/produce/:id', authenticate, authorize(['FARMER', 'FPO', 'ADMIN']), farmerController.updateProduce);
router.delete('/produce/:id', authenticate, authorize(['FARMER', 'FPO', 'ADMIN']), farmerController.deleteProduce);
router.get('/:id', farmerController.getFarmerById);

module.exports = router;
