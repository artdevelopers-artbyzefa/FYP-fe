/**
 * Authentication & Authorization Middleware
 *
 * Provides JWT-based authentication and role-based access control (RBAC).
 * Attaches decoded user payload to req.user for downstream handlers.
 *
 * @module middleware/auth
 *
 * @example
 * // Protect a route with authentication
 * router.get('/profile', authenticate, controller.getProfile);
 *
 * @example
 * // Restrict to specific roles
 * router.delete('/users/:id', authenticate, authorize('admin'), controller.deleteUser);
 */

const jwt = require('jsonwebtoken');
const { sendUnauthorized, sendForbidden } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

/**
 * Authenticate request via JWT Bearer token.
 *
 * Extracts token from Authorization header, verifies it,
 * and attaches decoded payload to req.user.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 *
 * @returns {void}
 *
 * @throws {401} If token is missing, malformed, or expired
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendUnauthorized(res, 'No token provided. Authorization denied.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorized(res, 'Token has expired. Please login again.');
    }
    return sendUnauthorized(res, 'Invalid token. Authorization denied.');
  }
};

/**
 * Authorize by role(s).
 *
 * Must be used AFTER authenticate middleware.
 * Checks if req.user.role matches one of the allowed roles.
 *
 * @param {...string} allowedRoles - Roles permitted to access the route
 * @returns {function} Express middleware function
 *
 * @example
 * // Only admin can access
 * authorize('admin')
 *
 * @example
 * // Multiple roles
 * authorize('admin', 'hod', 'office-incharge')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendUnauthorized(res, 'Authentication required before authorization.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendForbidden(res, `Access denied. Required role: ${allowedRoles.join(' or ')}`);
    }

    next();
  };
};

/**
 * Optional authentication.
 * Attaches user if token is present, but does NOT block unauthenticated requests.
 * Useful for routes that behave differently for logged-in users vs guests.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (_) {
      // Silently ignore invalid tokens for optional auth
    }
  }

  next();
};

module.exports = { authenticate, authorize, optionalAuth };
