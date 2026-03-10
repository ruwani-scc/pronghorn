/**
 * Item Service
 * Data access layer for itinerary item operations
 * Handles all database queries for items
 */

const db = require('../config/database');

class ItemService {
  /**
   * Find all items for a specific itinerary
   * @param {string} itineraryId - Itinerary UUID
   * @param {Object} options - Query options (category filter, sort)
   * @returns {Promise<Array>} - Array of items
   */
  static async findByItineraryId(itineraryId, options = {}) {
    const { category, sortBy = 'display_order', sortOrder = 'ASC' } = options;
    
    let query = `
      SELECT
        id,
        itinerary_id,
        category,
        title,
        description,
        start_datetime,
        end_datetime,
        location,
        confirmation_code,
        cost,
        currency,
        metadata,
        display_order,
        is_completed,
        created_at,
        updated_at
      FROM itinerary_items
      WHERE itinerary_id = $1
    `;
    
    const params = [itineraryId];
    
    if (category) {
      query += ' AND category = $2';
      params.push(category);
    }
    
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    
    const result = await db.query(query, params);
    return result.rows;
  }
  
  /**
   * Find single item by ID
   * @param {string} id - Item UUID
   * @returns {Promise<Object|null>} - Item object or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM itinerary_items WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }
  
  /**
   * Create new item
   * @param {Object} data - Item data
   * @returns {Promise<Object>} - Created item
   */
  static async create(data) {
    const query = `
      INSERT INTO itinerary_items (
        itinerary_id,
        category,
        title,
        description,
        start_datetime,
        end_datetime,
        location,
        confirmation_code,
        cost,
        currency,
        metadata,
        display_order,
        is_completed
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const values = [
      data.itinerary_id,
      data.category,
      data.title,
      data.description || null,
      data.start_datetime || null,
      data.end_datetime || null,
      data.location || null,
      data.confirmation_code || null,
      data.cost || null,
      data.currency || 'USD',
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.display_order || 0,
      data.is_completed || false
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  /**
   * Update item
   * @param {string} id - Item UUID
   * @param {Object} data - Update data
   * @returns {Promise<Object|null>} - Updated item or null
   */
  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    const updateableFields = [
      'category', 'title', 'description', 'start_datetime', 'end_datetime',
      'location', 'confirmation_code', 'cost', 'currency', 'metadata',
      'display_order', 'is_completed'
    ];
    
    updateableFields.forEach(field => {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramCount++}`);
        values.push(field === 'metadata' && typeof data[field] === 'object'
          ? JSON.stringify(data[field])
          : data[field]);
      }
    });
    
    fields.push(`updated_at = NOW()`);
    
    if (fields.length === 1) {
      return this.findById(id);
    }
    
    values.push(id);
    
    const query = `
      UPDATE itinerary_items
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }
  
  /**
   * Delete item
   * @param {string} id - Item UUID
   * @returns {Promise<boolean>} - True if deleted
   */
  static async delete(id) {
    const query = 'DELETE FROM itinerary_items WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }
  
  /**
   * Bulk delete items
   * @param {Array<string>} ids - Array of item UUIDs
   * @returns {Promise<number>} - Number of deleted items
   */
  static async bulkDelete(ids) {
    const query = 'DELETE FROM itinerary_items WHERE id = ANY($1)';
    const result = await db.query(query, [ids]);
    return result.rowCount;
  }
  
  /**
   * Reorder items
   * @param {Array<Object>} items - Array of {id, display_order}
   * @returns {Promise<boolean>} - True if successful
   */
  static async reorder(items) {
    return await db.transaction(async (client) => {
      for (const item of items) {
        await client.query(
          'UPDATE itinerary_items SET display_order = $1, updated_at = NOW() WHERE id = $2',
          [item.display_order, item.id]
        );
      }
      return true;
    });
  }
  
  /**
   * Get itinerary ID for an item
   * @param {string} itemId - Item UUID
   * @returns {Promise<string|null>} - Itinerary UUID or null
   */
  static async getItineraryId(itemId) {
    const query = 'SELECT itinerary_id FROM itinerary_items WHERE id = $1';
    const result = await db.query(query, [itemId]);
    return result.rows[0]?.itinerary_id || null;
  }
  
  /**
   * Count items by category for an itinerary
   * @param {string} itineraryId - Itinerary UUID
   * @returns {Promise<Object>} - Category counts
   */
  static async countByCategory(itineraryId) {
    const query = `
      SELECT
        category,
        COUNT(*) as count
      FROM itinerary_items
      WHERE itinerary_id = $1
      GROUP BY category
    `;
    
    const result = await db.query(query, [itineraryId]);
    
    const counts = {
      accommodation: 0,
      activity: 0,
      transport: 0
    };
    
    result.rows.forEach(row => {
      counts[row.category] = parseInt(row.count);
    });
    
    return counts;
  }
  
  /**
   * Toggle item completion status
   * @param {string} id - Item UUID
   * @returns {Promise<Object|null>} - Updated item or null
   */
  static async toggleCompletion(id) {
    const query = `
      UPDATE itinerary_items
      SET is_completed = NOT is_completed, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }
}

module.exports = ItemService;
