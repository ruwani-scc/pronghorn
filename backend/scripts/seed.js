/**
 * Database Seed Script
 * Populates database with sample data for development and testing
 */

const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const SEEDS_DIR = path.join(__dirname, '../database/seeds');

/**
 * Run all seed files
 */
async function runSeeds() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Test database connection
    const connected = await db.testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }
    
    // Get all seed files
    const files = fs.readdirSync(SEEDS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    if (files.length === 0) {
      console.log('⚠️  No seed files found');
      return;
    }
    
    console.log(`📁 Found ${files.length} seed file(s)`);
    
    // Run each seed file
    for (const file of files) {
      console.log(`\n📝 Running seed: ${file}`);
      const filePath = path.join(SEEDS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await db.query(sql);
        console.log(`✅ Seed completed: ${file}`);
      } catch (error) {
        console.error(`❌ Seed failed: ${file}`);
        console.error(error.message);
        throw error;
      }
    }
    
    console.log('\n✅ All seeds completed successfully!');
    
    // Display summary
    await displaySummary();
  } catch (error) {
    console.error('\n❌ Seeding error:', error.message);
    process.exit(1);
  } finally {
    await db.close();
  }
}

/**
 * Display summary of seeded data
 */
async function displaySummary() {
  try {
    const userCount = await db.query('SELECT COUNT(*) as count FROM users');
    const itineraryCount = await db.query('SELECT COUNT(*) as count FROM itineraries');
    const itemCount = await db.query('SELECT COUNT(*) as count FROM itinerary_items');
    
    console.log('\n📊 Database Summary:');
    console.log(`   Users: ${userCount.rows[0].count}`);
    console.log(`   Itineraries: ${itineraryCount.rows[0].count}`);
    console.log(`   Items: ${itemCount.rows[0].count}`);
  } catch (error) {
    console.log('⚠️  Could not fetch summary');
  }
}

// Run seeds if script is executed directly
if (require.main === module) {
  runSeeds();
}

module.exports = runSeeds;
