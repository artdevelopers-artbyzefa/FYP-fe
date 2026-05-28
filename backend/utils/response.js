/**
 * Standardized API Response Helpers
 *
 * Provides consistent response structures for all API endpoints.
 * Every response follows: { success, message, data?, error?, meta? }
 *
 * @module utils/response
 */

/**
 * Send a success response (200).
 *
 * @param {object} res - Express response object
 * @param {*} [data=null] - Response payload
 * @param {string} [message='Success'] - Success message
 * @param {number} [statusCode=200] - HTTP status code
 * @param {object} [meta={}] - Additional metadata (pagination, etc.)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = {}) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  if (Object.keys(meta).length) body.meta = meta;
  return res.status(statusCode).json(body);
};

/**
 * Send a created response (201).
 * Convenience wrapper around sendSuccess.
 */
const sendCreated = (res, data = null, message = 'Resource created') => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Send an error response.
 *
 * @param {object} res - Express response object
 * @param {string} [message='Something went wrong'] - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {*} [error=null] - Detailed error info (stack, validation errors, etc.)
 */
const sendError = (res, message = 'Something went wrong', statusCode = 500, error = null) => {
  const body = { success: false, message };
  if (error !== null) body.error = error;
  return res.status(statusCode).json(body);
};

/**
 * Send a validation error response (422).
 */
const sendValidationError = (res, errors) => {
  return sendError(res, 'Validation failed', 422, errors);
};

/**
 * Send an unauthorized response (401).
 */
const sendUnauthorized = (res, message = 'Authentication required') => {
  return sendError(res, message, 401);
};

/**
 * Send a forbidden response (403).
 */
const sendForbidden = (res, message = 'Insufficient permissions') => {
  return sendError(res, message, 403);
};

/**
 * Send a not-found response (404).
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404);
};

module.exports = {
  sendSuccess,
  sendCreated,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
};
