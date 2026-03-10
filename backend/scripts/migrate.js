/**
 * Database Migration Script
 * Runs SQL migration files to set up database schema
 */

const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const MIGRATIONS_DIR = path.join(__dirname, '../database/migrations');

/**
 * Run all migration files in order
 */
async function runMigrations() {
  console.log('🔄 Starting database migrations...');
  
  try {
    // Test database connection
    const connected = await db.testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }
    
    // Get all migration files
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Run in alphabetical order
    
    if (files.length === 0) {
      console.log('⚠️  No migration files found');
      return;
    }
    
    console.log(`📁 Found ${files.length} migration file(s)`);
    
    // Run each migration
    for (const file of files) {
      console.log(`\n📝 Running migration: ${file}`);
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await db.query(sql);
        console.log(`✅ Migration completed: ${file}`);
      } catch (error) {
        console.error(`❌ Migration failed: ${file}`);
        console.error(error.message);
        throw error;
      }
    }
    
    console.log('\n✅ All migrations completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// Run migrations if script is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
