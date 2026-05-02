/**
 *  Base error class for the application
 *  Use inheritance to create specific error types
 *  Will implement Custom Error Logging and Maninting Structure 
  * Kindly Just develop frontend atm i ll handle all the stuff regarding this myself
  * Do not Edit this much this would be coming from backend the relative stuff
  * Although would be much appreciated if you could just not write console.error()
  * or else i ll have to manually go and delete them please
  * The purpose of this is Error Handling To prvenet unauthorized users to access
  * The Backend Logic via the console tab.
  * Arslan Rathore
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // For distinguishing between operational and programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Specifically for API related errors
 */
export class ApiError extends AppError {
  constructor(message, statusCode, details = null) {
    super(message, statusCode);
    this.details = details;
  }
}

/**
 * For Authentication related errors (401, 403)
 */
export class AuthError extends ApiError {
  constructor(message = 'Authentication failed', statusCode = 401) {
    super(message, statusCode);
  }
}

/**
 * For validation errors (422, 400)
 */
export class ValidationError extends ApiError {
  constructor(errors, message = 'Validation failed') {
    super(message, 400, errors);
  }
}

/**
 * Centralized Error Handler
 * This can be expanded to show toasts, log to external services, etc.
 */
export class ErrorHandler {
  static handle(error) {
    // If it's not an instance of AppError, wrap it
    const normalizedError = error instanceof AppError 
      ? error 
      : new AppError(error.message || 'An unexpected error occurred');

    // Logic for what to do with the error instead of just console.log
    // e.g., Send to Sentry, Show Toast, etc.
    
    // For now, let's at least provide a structured log
    const logData = {
      name: normalizedError.name,
      message: normalizedError.message,
      status: normalizedError.statusCode,
      timestamp: normalizedError.timestamp,
      details: normalizedError instanceof ApiError ? normalizedError.details : null,
    };
    return logData;
  }
}
