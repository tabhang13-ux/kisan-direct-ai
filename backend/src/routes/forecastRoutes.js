const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');

router.post('/demand', forecastController.predictCropDemand);
router.post('/price', forecastController.recommendListingPrice);

module.exports = router;
