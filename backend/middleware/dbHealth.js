/**
 * Database Health Middleware
 *
 * Checks if MongoDB is connected before processing requests
 * that require database access. Returns 503 if database is down.
 *
 * @module middleware/dbHealth
 */

const { getDbStatus } = require('../config/db');
const { sendError } = require('../utils/response');

/**
 * Middleware that blocks requests when database is disconnected.
 * All routes that require DB should use this.
 * Health check and public routes can skip it.
 *
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next
 */
const requireDb = (req, res, next) => {
  if (!getDbStatus()) {
    return sendError(res, 'Database unavailable. Please try again later.', 503);
  }
  next();
};

module.exports = { requireDb };
