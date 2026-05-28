/**
 * Authentication Controller
 *
 * Handles user authentication: register, login, logout, token refresh.
 * Uses bcrypt for password hashing and JWT for session management.
 *
 * @module controllers/auth
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendSuccess, sendCreated, sendError, sendUnauthorized } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a JWT token for a user.
 *
 * @param {object} user - User document from database
 * @returns {string} Signed JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
};

/**
 * POST /api/auth/register
 * Creates a new user account with hashed password.
 *
 * @param {object} req - Express request
 * @param {object} req.body - { name, email, password, role? }
 * @param {object} res - Express response
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    // Check if user already exists
    const User = require('mongoose').model('User');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'A user with this email already exists', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: 'Active',
    });

    // Generate token
    const token = generateToken(user);

    return sendCreated(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    }, 'Account created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticates a user with email and password.
 * Returns JWT token and user data on success.
 *
 * @param {object} req - Express request
 * @param {object} req.body - { email, password }
 * @param {object} res - Express response
 *
 * @returns {object} { token, user: { id, name, email, role, status } }
 *
 * @throws 401 - Invalid credentials
 * @throws 403 - Account locked or deactivated
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const User = require('mongoose').model('User');
    const user = await User.findOne({ email });

    if (!user) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    // Check account status
    if (user.status === 'Locked' || user.status === 'Deactivated') {
      return sendError(res, `Account is ${user.status.toLowerCase()}. Contact administrator.`, 403);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user);

    return sendSuccess(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Logs out the current user.
 * Primarily acknowledges the logout (actual token invalidation is client-side).
 *
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
const logout = async (req, res) => {
  return sendSuccess(res, null, 'Logged out successfully');
};

/**
 * POST /api/auth/refresh-token
 * Issues a new JWT token.
 * For simplicity, generates a new token for the current user.
 * In production, implement refresh token rotation.
 *
 * @param {object} req - Express request
 * @param {object} req.body - { refreshToken? }
 * @param {object} res - Express response
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      // If no refresh token, use the current auth token to generate a new one
      if (req.user) {
        const newToken = generateToken(req.user);
        return sendSuccess(res, { token: newToken }, 'Token refreshed');
      }
      return sendUnauthorized(res, 'Refresh token is required');
    }

    // Verify the refresh token and issue a new one
    const decoded = jwt.verify(token, JWT_SECRET);
    const User = require('mongoose').model('User');
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendUnauthorized(res, 'User not found');
    }

    const newToken = generateToken(user);
    return sendSuccess(res, { token: newToken }, 'Token refreshed');
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendUnauthorized(res, 'Invalid or expired refresh token');
    }
    next(error);
  }
};

module.exports = { register, login, logout, refreshToken };
