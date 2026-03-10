/**
 * Request Logger Middleware
 * Enhanced logging for API requests with performance tracking
 */

/**
 * Custom request logger with performance metrics
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  // Attach request ID to request object
  req.requestId = requestId;
  
  // Log incoming request
  if (process.env.LOG_LEVEL !== 'silent') {
    console.log('📥 Incoming Request:', {
      requestId,
      method: req.method,
      url: req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });
  }
  
  // Store original send function
  const originalSend = res.send;
  
  // Override send to capture response
  res.send = function (data) {
    const duration = Date.now() - startTime;
    
    // Log response
    if (process.env.LOG_LEVEL !== 'silent') {
      const logLevel = res.statusCode >= 400 ? '❌' : '✅';
      console.log(`${logLevel} Response:`, {
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Add custom headers
    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    // Warn about slow requests
    if (duration > 1000) {
      console.warn('⚠️  Slow request detected:', {
        requestId,
        url: req.url,
        duration: `${duration}ms`
      });
      // TODO: Send to monitoring service (Datadog)
    }
    
    // Call original send
    originalSend.call(this, data);
  };
  
  next();
};

/**
 * Generate unique request ID
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log database queries (for debugging)
 */
function logQuery(query, params, duration) {
  if (process.env.LOG_QUERIES === 'true') {
    console.log('🗄️  Database Query:', {
      query: query.substring(0, 100) + '...',
      params,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Log errors with context
 */
function logError(error, req) {
  console.error('❌ Error:', {
    requestId: req?.requestId,
    method: req?.method,
    url: req?.url,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    timestamp: new Date().toISOString()
  });
  
  // TODO: Send to error tracking service (Sentry)
}

/**
 * Structured logging utility
 */
const logger = {
  info: (message, data = {}) => {
    if (process.env.LOG_LEVEL !== 'silent') {
      console.log(`ℹ️  ${message}`, {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  },
  
  warn: (message, data = {}) => {
    console.warn(`⚠️  ${message}`, {
      ...data,
      timestamp: new Date().toISOString()
    });
  },
  
  error: (message, error = null, data = {}) => {
    console.error(`❌ ${message}`, {
      ...data,
      error: error ? {
        message: error.message,
        stack: error.stack
      } : null,
      timestamp: new Date().toISOString()
    });
  },
  
  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
      console.debug(`🐛 ${message}`, {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  },
  
  query: logQuery,
  errorWithContext: logError
};

module.exports = requestLogger;
module.exports.logger = logger;
module.exports.generateRequestId = generateRequestId;
