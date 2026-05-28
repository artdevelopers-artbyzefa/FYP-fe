/**
 * Global Error Handling Middleware
 *
 * Centralized error handler that catches all unhandled errors
 * and returns standardized error responses.
 *
 * @module middleware/errorHandler
 */

const { sendError } = require('../utils/response');

/**
 * Global error handling middleware.
 * Must be registered AFTER all routes.
 *
 * Handles:
 * - Mongoose ValidationError (400)
 * - Mongoose CastError (400)
 * - Mongoose DuplicateKeyError (409)
 * - JWT errors (401)
 * - Generic errors (500)
 *
 * @param {Error} err - The error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} _next - Express next middleware (unused)
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(res, 'Validation failed', 400, errors);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return sendError(res, `Invalid ${err.path}: ${err.value}`, 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, `Duplicate value for ${field}. This ${field} already exists.`, 409);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired', 401);
  }

  // Multer file upload error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, 'File too large. Maximum size is 10MB.', 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return sendError(res, 'Unexpected file field', 400);
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error';
  const errorDetail = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  return sendError(res, message, statusCode, errorDetail);
};

/**
 * 404 handler for unknown routes.
 * Must be registered AFTER all routes and BEFORE errorHandler.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const notFoundHandler = (req, res) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

module.exports = { errorHandler, notFoundHandler };
