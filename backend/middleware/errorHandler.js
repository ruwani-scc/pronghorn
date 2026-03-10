/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 * Returns consistent error response format
 */

/**
 * Custom error class for application-specific errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 * Must be the last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 Internal Server Error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;
  
  // Log error details (in production, send to logging service)
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      message: err.message,
      statusCode,
      stack: err.stack,
      errors
    });
  } else {
    // TODO: Send error to monitoring service (Sentry, Datadog)
    console.error('Error:', err.message);
  }
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = formatValidationErrors(err);
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.code === '23505') { // PostgreSQL unique violation
    statusCode = 409;
    message = 'Duplicate entry';
  } else if (err.code === '23503') { // PostgreSQL foreign key violation
    statusCode = 400;
    message = 'Invalid reference';
  }
  
  // Build error response
  const errorResponse = {
    success: false,
    error: message
  };
  
  // Include validation errors if present
  if (errors) {
    errorResponse.errors = errors;
  }
  
  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
};

/**
 * Format validation errors into consistent structure
 */
const formatValidationErrors = (err) => {
  const errors = {};
  
  if (err.errors) {
    Object.keys(err.errors).forEach(key => {
      errors[key] = err.errors[key].message;
    });
  }
  
  return errors;
};

/**
 * Async wrapper to catch errors in async route handlers
 * Usage: asyncHandler(async (req, res) => { ... })
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found error creator
 */
const notFound = (message = 'Resource not found') => {
  return new AppError(message, 404);
};

/**
 * Unauthorized error creator
 */
const unauthorized = (message = 'Unauthorized access') => {
  return new AppError(message, 401);
};

/**
 * Forbidden error creator
 */
const forbidden = (message = 'Access forbidden') => {
  return new AppError(message, 403);
};

/**
 * Bad request error creator
 */
const badRequest = (message = 'Bad request', errors = null) => {
  return new AppError(message, 400, errors);
};

module.exports = errorHandler;
module.exports.AppError = AppError;
module.exports.asyncHandler = asyncHandler;
module.exports.notFound = notFound;
module.exports.unauthorized = unauthorized;
module.exports.forbidden = forbidden;
module.exports.badRequest = badRequest;
