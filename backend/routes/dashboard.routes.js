/**
 * Generic Dashboard Routes
 * Reserved for future use - provides generic dashboard stats.
 *
 * @route GET /api/dashboard/stats
 */

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getStats } = require('../controllers/dashboard.controller');

const router = express.Router();

router.use(authenticate);
router.get('/stats', getStats);

module.exports = router;
