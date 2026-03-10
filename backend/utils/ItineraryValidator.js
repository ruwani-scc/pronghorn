/**
 * Itinerary Validator Utility
 * Validates itinerary and item data
 * Returns structured error messages
 */

class ItineraryValidator {
  /**
   * Validate itinerary data
   * @param {Object} data - Itinerary data to validate
   * @param {Boolean} isUpdate - True if validating update (allows partial data)
   * @returns {Object} - { isValid: boolean, errors: Object }
   */
  static validateItinerary(data, isUpdate = false) {
    const errors = {};
    
    // Required fields for creation
    if (!isUpdate) {
      if (!data.title || data.title.trim() === '') {
        errors.title = 'Title is required';
      }
      
      if (!data.start_date) {
        errors.start_date = 'Start date is required';
      }
      
      if (!data.end_date) {
        errors.end_date = 'End date is required';
      }
    }
    
    // Validate title length
    if (data.title && data.title.length > 255) {
      errors.title = 'Title must be 255 characters or less';
    }
    
    // Validate dates
    if (data.start_date) {
      if (!this.isValidDate(data.start_date)) {
        errors.start_date = 'Invalid start date format (use YYYY-MM-DD)';
      }
    }
    
    if (data.end_date) {
      if (!this.isValidDate(data.end_date)) {
        errors.end_date = 'Invalid end date format (use YYYY-MM-DD)';
      }
    }
    
    // Validate date range
    if (data.start_date && data.end_date && this.isValidDate(data.start_date) && this.isValidDate(data.end_date)) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      
      if (endDate < startDate) {
        errors.end_date = 'End date must be after or equal to start date';
      }
      
      // Check trip duration (max 365 days)
      const daysDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);
      if (daysDiff > 365) {
        errors.end_date = 'Trip duration cannot exceed 365 days';
      }
    }
    
    // Validate destination length
    if (data.destination && data.destination.length > 255) {
      errors.destination = 'Destination must be 255 characters or less';
    }
    
    // Validate description length
    if (data.description && data.description.length > 5000) {
      errors.description = 'Description must be 5000 characters or less';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : null
    };
  }
  
  /**
   * Validate itinerary item data
   * @param {Object} data - Item data to validate
   * @param {Boolean} isUpdate - True if validating update
   * @returns {Object} - { isValid: boolean, errors: Object }
   */
  static validateItem(data, isUpdate = false) {
    const errors = {};
    const validCategories = ['accommodation', 'activity', 'transport'];
    
    // Required fields for creation
    if (!isUpdate) {
      if (!data.category) {
        errors.category = 'Category is required';
      }
      
      if (!data.title || data.title.trim() === '') {
        errors.title = 'Title is required';
      }
    }
    
    // Validate category
    if (data.category && !validCategories.includes(data.category)) {
      errors.category = `Category must be one of: ${validCategories.join(', ')}`;
    }
    
    // Validate title length
    if (data.title && data.title.length > 255) {
      errors.title = 'Title must be 255 characters or less';
    }
    
    // Validate description length
    if (data.description && data.description.length > 5000) {
      errors.description = 'Description must be 5000 characters or less';
    }
    
    // Validate datetime fields
    if (data.start_datetime && !this.isValidDateTime(data.start_datetime)) {
      errors.start_datetime = 'Invalid start datetime format (use ISO 8601)';
    }
    
    if (data.end_datetime && !this.isValidDateTime(data.end_datetime)) {
      errors.end_datetime = 'Invalid end datetime format (use ISO 8601)';
    }
    
    // Validate datetime range
    if (data.start_datetime && data.end_datetime) {
      const start = new Date(data.start_datetime);
      const end = new Date(data.end_datetime);
      
      if (end < start) {
        errors.end_datetime = 'End datetime must be after start datetime';
      }
    }
    
    // Validate location length
    if (data.location && data.location.length > 255) {
      errors.location = 'Location must be 255 characters or less';
    }
    
    // Validate confirmation code length
    if (data.confirmation_code && data.confirmation_code.length > 100) {
      errors.confirmation_code = 'Confirmation code must be 100 characters or less';
    }
    
    // Validate cost
    if (data.cost !== undefined && data.cost !== null) {
      const cost = parseFloat(data.cost);
      if (isNaN(cost) || cost < 0) {
        errors.cost = 'Cost must be a positive number';
      }
      if (cost > 999999.99) {
        errors.cost = 'Cost cannot exceed 999,999.99';
      }
    }
    
    // Validate currency
    if (data.currency && data.currency.length !== 3) {
      errors.currency = 'Currency must be a 3-letter code (e.g., USD, EUR)';
    }
    
    // Validate display_order
    if (data.display_order !== undefined && data.display_order !== null) {
      const order = parseInt(data.display_order);
      if (isNaN(order) || order < 0) {
        errors.display_order = 'Display order must be a non-negative integer';
      }
    }
    
    // Validate metadata (must be object if provided)
    if (data.metadata && typeof data.metadata !== 'object') {
      errors.metadata = 'Metadata must be a valid JSON object';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : null
    };
  }
  
  /**
   * Check if string is a valid date (YYYY-MM-DD)
   */
  static isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
  
  /**
   * Check if string is a valid ISO 8601 datetime
   */
  static isValidDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date instanceof Date && !isNaN(date);
  }
}

module.exports = ItineraryValidator;
