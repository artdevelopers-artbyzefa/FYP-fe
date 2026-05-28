/**
 * User Profile Routes
 *
 * Generic user profile get/update endpoints.
 * Works for all authenticated user types.
 *
 * @route GET  /api/user/profile
 * @route POST /api/user/profile
 */

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/user.controller');

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.post('/profile', updateProfile);

module.exports = router;
