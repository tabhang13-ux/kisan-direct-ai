const express = require('express');
const router = express.Router();
const demoController = require('../controllers/demoController');

router.post('/scenario', demoController.runSihDemoScenario);

module.exports = router;
