/**
 * Request Validation Middleware
 *
 * Provides reusable validation chains using express-validator.
 * Validates request body, query params, and path params.
 * Returns 422 with field-level errors on failure.
 *
 * @module middleware/validate
 *
 * @example
 * const { body, query } = require('express-validator');
 * const { validate } = require('../middleware/validate');
 *
 * router.post(
 *   '/students',
 *   [
 *     body('email').isEmail().withMessage('Valid email is required'),
 *     body('name').notEmpty().withMessage('Name is required'),
 *   ],
 *   validate,
 *   controller.createStudent
 * );
 */

const { validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/response');

/**
 * Middleware that checks express-validator results.
 * If validation errors exist, returns 422 with error details.
 * Otherwise passes to the next handler.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      location: err.location || 'body',
      value: err.value,
    }));
    return sendValidationError(res, formatted);
  }

  next();
};

module.exports = { validate };
