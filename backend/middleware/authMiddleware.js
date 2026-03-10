/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user info to request
 * Integrates with external auth provider (Auth0/Firebase)
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT
 * Expects Authorization header: Bearer <token>
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authorization token provided'
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // TODO: Verify token with external auth provider (Auth0/Firebase)
    // For now, using mock JWT verification
    try {
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // const user = await UserService.findById(decoded.userId);
      
      // Mock user object for development
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174999',
        email: 'user@example.com',
        auth_provider_id: 'auth0|123456789'
      };
      
      // Attach user to request object
      req.user = mockUser;
      next();
    } catch (verifyError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

/**
 * Optional middleware for routes that work with or without authentication
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        // TODO: Verify token
        const mockUser = {
          id: '123e4567-e89b-12d3-a456-426614174999',
          email: 'user@example.com',
          auth_provider_id: 'auth0|123456789'
        };
        req.user = mockUser;
      } catch (verifyError) {
        // Token invalid, but continue without user
        req.user = null;
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuth;
