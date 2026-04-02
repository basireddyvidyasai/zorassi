const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/dashboardController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/summary', protect, restrictTo('Viewer', 'Analyst', 'Admin'), getSummary);

module.exports = router;
