/**
 * Database Configuration
 * PostgreSQL connection setup
 * Supports connection pooling and environment-based config
 */

const { Pool } = require('pg');

// Database configuration from environment variables
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'vacation_plan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  
  // Connection pool settings
  max: parseInt(process.env.DB_POOL_MAX) || 20, // Maximum pool size
  min: parseInt(process.env.DB_POOL_MIN) || 2,  // Minimum pool size
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection cannot be established
  
  // SSL configuration (required for production)
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

// Create connection pool
const pool = new Pool(config);

// Log pool errors
pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle database client', err);
  // TODO: Send to error tracking service (Sentry)
});

// Log successful connection
pool.on('connect', (client) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Database client connected');
  }
});

/**
 * Query helper function
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} - Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.warn('⚠️  Slow query detected:', {
        text,
        duration: `${duration}ms`,
        rows: result.rowCount
      });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Database query error:', {
      text,
      error: error.message
    });
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise} - Database client
 */
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

/**
 * Transaction helper
 * @param {Function} callback - Async function to execute in transaction
 * @returns {Promise} - Transaction result
 */
const transaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Test database connection
 * @returns {Promise<boolean>}
 */
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

/**
 * Close database pool
 * Should be called on application shutdown
 */
const close = async () => {
  await pool.end();
  console.log('🔌 Database pool closed');
};

// Export pool and helper functions
module.exports = {
  pool,
  query,
  getClient,
  transaction,
  testConnection,
  close
};
