/**
 * Database Reset Script
 * Drops all tables and re-runs migrations and seeds
 * WARNING: This will delete all data!
 */

const readline = require('readline');
const db = require('../config/database');
const runMigrations = require('./migrate');
const runSeeds = require('./seed');

/**
 * Prompt user for confirmation
 */
function promptConfirmation() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(
      '⚠️  WARNING: This will DELETE ALL DATA in the database. Continue? (yes/no): ',
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'yes');
      }
    );
  });
}

/**
 * Drop all tables
 */
async function dropAllTables() {
  console.log('\n🗑️  Dropping all tables...');
  
  try {
    const dropSQL = `
      -- Drop tables in reverse order to handle foreign key constraints
      DROP TABLE IF EXISTS itinerary_items CASCADE;
      DROP TABLE IF EXISTS itineraries CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      
      -- Drop functions
      DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
      
      -- Drop extensions if needed
      -- DROP EXTENSION IF EXISTS "uuid-ossp";
    `;
    
    await db.query(dropSQL);
    console.log('✅ All tables dropped successfully');
  } catch (error) {
    console.error('❌ Error dropping tables:', error.message);
    throw error;
  }
}

/**
 * Reset database: drop tables, run migrations, run seeds
 */
async function resetDatabase() {
  console.log('🔄 Starting database reset...');
  
  try {
    // Test database connection
    const connected = await db.testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }
    
    // Only ask for confirmation in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      const confirmed = await promptConfirmation();
      if (!confirmed) {
        console.log('❌ Reset cancelled by user');
        process.exit(0);
      }
    }
    
    // Drop all tables
    await dropAllTables();
    
    // Close current connection
    await db.close();
    
    // Run migrations
    console.log('\n📋 Running migrations...');
    await runMigrations();
    
    // Run seeds
    console.log('\n🌱 Running seeds...');
    await runSeeds();
    
    console.log('\n✅ Database reset completed successfully!');
  } catch (error) {
    console.error('\n❌ Reset error:', error.message);
    process.exit(1);
  }
}

// Run reset if script is executed directly
if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;
