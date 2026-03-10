/**
 * Itinerary Service
 * Data access layer for itinerary operations
 * Handles all database queries for itineraries
 */

const db = require('../config/database');

class ItineraryService {
  /**
   * Find all itineraries for a specific user
   * @param {string} userId - User UUID
   * @param {Object} options - Query options (limit, offset, sort)
   * @returns {Promise<Array>} - Array of itineraries
   */
  static async findByUserId(userId, options = {}) {
    const {
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;
    
    const query = `
      SELECT 
        id,
        user_id,
        title,
        destination,
        start_date,
        end_date,
        description,
        created_at,
        updated_at
      FROM itineraries
      WHERE user_id = $1
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $2 OFFSET $3
    `;
    
    const result = await db.query(query, [userId, limit, offset]);
    return result.rows;
  }
  
  /**
   * Find single itinerary by ID
   * @param {string} id - Itinerary UUID
   * @returns {Promise<Object|null>} - Itinerary object or null
   */
  static async findById(id) {
    const query = `
      SELECT 
        id,
        user_id,
        title,
        destination,
        start_date,
        end_date,
        description,
        created_at,
        updated_at
      FROM itineraries
      WHERE id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }
  
  /**
   * Create new itinerary
   * @param {Object} data - Itinerary data
   * @returns {Promise<Object>} - Created itinerary
   */
  static async create(data) {
    const query = `
      INSERT INTO itineraries (
        user_id,
        title,
        destination,
        start_date,
        end_date,
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      data.user_id,
      data.title,
      data.destination || null,
      data.start_date,
      data.end_date,
      data.description || null
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  /**
   * Update itinerary
   * @param {string} id - Itinerary UUID
   * @param {Object} data - Update data
   * @returns {Promise<Object|null>} - Updated itinerary or null
   */
  static async update(id, data) {
    // Build dynamic update query based on provided fields
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    if (data.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(data.title);
    }
    
    if (data.destination !== undefined) {
      fields.push(`destination = $${paramCount++}`);
      values.push(data.destination);
    }
    
    if (data.start_date !== undefined) {
      fields.push(`start_date = $${paramCount++}`);
      values.push(data.start_date);
    }
    
    if (data.end_date !== undefined) {
      fields.push(`end_date = $${paramCount++}`);
      values.push(data.end_date);
    }
    
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    
    // Always update updated_at
    fields.push(`updated_at = NOW()`);
    
    if (fields.length === 1) {
      // Only updated_at, nothing to update
      return this.findById(id);
    }
    
    values.push(id);
    
    const query = `
      UPDATE itineraries
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }
  
  /**
   * Delete itinerary
   * @param {string} id - Itinerary UUID
   * @returns {Promise<boolean>} - True if deleted
   */
  static async delete(id) {
    const query = 'DELETE FROM itineraries WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }
  
  /**
   * Check if user owns itinerary
   * @param {string} itineraryId - Itinerary UUID
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} - True if user owns itinerary
   */
  static async checkOwnership(itineraryId, userId) {
    const query = 'SELECT id FROM itineraries WHERE id = $1 AND user_id = $2';
    const result = await db.query(query, [itineraryId, userId]);
    return result.rows.length > 0;
  }
  
  /**
   * Get itinerary count for user
   * @param {string} userId - User UUID
   * @returns {Promise<number>} - Count of itineraries
   */
  static async countByUserId(userId) {
    const query = 'SELECT COUNT(*) as count FROM itineraries WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }
  
  /**
   * Search itineraries by title or destination
   * @param {string} userId - User UUID
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} - Matching itineraries
   */
  static async search(userId, searchTerm) {
    const query = `
      SELECT *
      FROM itineraries
      WHERE user_id = $1
        AND (title ILIKE $2 OR destination ILIKE $2)
      ORDER BY start_date DESC
    `;
    
    const result = await db.query(query, [userId, `%${searchTerm}%`]);
    return result.rows;
  }
}

module.exports = ItineraryService;
