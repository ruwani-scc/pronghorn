/**
 * Rate Limiting Middleware
 * Prevents API abuse by limiting request frequency
 */

const rateLimit = {};

/**
 * Simple in-memory rate limiter
 * For production, use Redis-backed rate limiting
 */
class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
    this.maxRequests = options.max || 100;
    this.message = options.message || 'Too many requests, please try again later';
    this.skipSuccessfulRequests = options.skipSuccessfulRequests || false;
    this.skipFailedRequests = options.skipFailedRequests || false;
    
    // Storage: { [ip]: { count, resetTime } }
    this.clients = new Map();
    
    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }
  
  /**
   * Get client identifier (IP address or user ID)
   */
  getClientId(req) {
    // Use user ID if authenticated, otherwise use IP
    if (req.user && req.user.id) {
      return `user:${req.user.id}`;
    }
    
    // Get IP from various headers (for proxy/load balancer support)
    return (
      req.ip ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress
    );
  }
  
  /**
   * Rate limiter middleware function
   */
  middleware() {
    return (req, res, next) => {
      const clientId = this.getClientId(req);
      const now = Date.now();
      
      let clientData = this.clients.get(clientId);
      
      // Initialize or reset if window expired
      if (!clientData || now > clientData.resetTime) {
        clientData = {
          count: 0,
          resetTime: now + this.windowMs
        };
        this.clients.set(clientId, clientData);
      }
      
      // Increment counter
      clientData.count++;
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - clientData.count));
      res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());
      
      // Check if limit exceeded
      if (clientData.count > this.maxRequests) {
        res.setHeader('Retry-After', Math.ceil((clientData.resetTime - now) / 1000));
        
        return res.status(429).json({
          success: false,
          error: this.message,
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
        });
      }
      
      next();
    };
  }
  
  /**
   * Cleanup expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [clientId, data] of this.clients.entries()) {
      if (now > data.resetTime) {
        this.clients.delete(clientId);
      }
    }
  }
  
  /**
   * Clear all rate limit data
   */
  reset() {
    this.clients.clear();
  }
  
  /**
   * Destroy rate limiter and cleanup interval
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.clients.clear();
  }
}

/**
 * Create rate limiter middleware
 */
function createRateLimiter(options) {
  const limiter = new RateLimiter(options);
  return limiter.middleware();
}

/**
 * Predefined rate limiters
 */

// General API rate limiter (100 requests per 15 minutes)
rateLimit.api = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});

// Strict rate limiter for sensitive endpoints (10 requests per 15 minutes)
rateLimit.strict = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many attempts, please try again later'
});

// Authentication rate limiter (5 requests per 15 minutes)
rateLimit.auth = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later'
});

module.exports = rateLimit;
module.exports.createRateLimiter = createRateLimiter;
module.exports.RateLimiter = RateLimiter;
