/**
 * Authentication Routes
 *
 * Handles user registration, login, logout, and token refresh.
 * Login validates credentials against the database and returns a JWT.
 * Registration creates a new user with hashed password.
 *
 * @module routes/auth
 *
 * @see controller/auth.controller
 * @see middleware/auth
 *
 * @route POST /api/auth/login
 * @route POST /api/auth/register
 * @route POST /api/auth/logout
 * @route POST /api/auth/refresh-token
 */

const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  login,
  register,
  logout,
  refreshToken,
} = require('../controllers/auth.controller');

const router = express.Router();

// ---------------------------------------------------------------------------
// POST /api/auth/register
// Creates a new user account. Hashes password, returns JWT on success.
// Body: { name, email, password, role? }
// Access: Public
// ---------------------------------------------------------------------------
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters'),
    body('role').optional().isIn(['student', 'faculty', 'hod', 'office-assistant', 'office-incharge', 'admin', 'industry']).withMessage('Invalid role'),
  ],
  validate,
  register,
);

// ---------------------------------------------------------------------------
// POST /api/auth/login
// Authenticates user with email + password. Returns JWT + user object.
// Body: { email, password }
// Access: Public
// Errors: 401 if credentials invalid, 404 if user not found
// ---------------------------------------------------------------------------
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login,
);

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// Invalidates current session (client-side token removal).
// Typically just acknowledges the logout request.
// Access: Authenticated
// ---------------------------------------------------------------------------
router.post('/logout', authenticate, logout);

// ---------------------------------------------------------------------------
// POST /api/auth/refresh-token
// Issues a new JWT using a valid refresh token.
// Body: { refreshToken }
// Access: Public (requires valid refresh token)
// ---------------------------------------------------------------------------
router.post(
  '/refresh-token',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ],
  validate,
  refreshToken,
);

module.exports = router;
