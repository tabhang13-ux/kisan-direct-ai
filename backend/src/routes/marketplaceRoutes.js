const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

router.get('/', marketplaceController.getMarketplaceListings);
router.get('/:id', marketplaceController.getListingById);

module.exports = router;
