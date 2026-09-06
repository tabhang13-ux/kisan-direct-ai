const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');

router.post('/find', matchingController.findMatches);

module.exports = router;
