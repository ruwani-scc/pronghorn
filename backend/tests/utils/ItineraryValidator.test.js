/**
 * ItineraryValidator Unit Tests
 * Tests for validation logic
 */

const ItineraryValidator = require('../../utils/ItineraryValidator');

describe('ItineraryValidator', () => {
  describe('validateItinerary', () => {
    it('should validate correct itinerary data', () => {
      // Arrange
      const validData = {
        title: 'Summer Vacation',
        destination: 'Paris, France',
        start_date: '2024-07-01',
        end_date: '2024-07-15',
        description: 'A wonderful trip'
      };
      
      // Act
      const result = ItineraryValidator.validateItinerary(validData);
      
      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toBeNull();
    });
    
    it('should require title for new itinerary', () => {
      // Arrange
      const invalidData = {
        start_date: '2024-07-01',
        end_date: '2024-07-15'
      };
      
      // Act
      const result = ItineraryValidator.validateItinerary(invalidData);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });
    
    it('should require start_date for new itinerary', () => {
      // Arrange
      const invalidData = {
        title: 'Test',
        end_date: '2024-07-15'
      };
      
      // Act
      const result = ItineraryValidator.validateItinerary(invalidData);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.start_date).toBeDefined();
    });
    
    it('should validate date range (end >= start)', () => {
      // Arrange
      const invalidData = {
        title: 'Test',
        start_date: '2024-07-15',
        end_date: '2024-07-01'
      };
      
      // Act
      const result = ItineraryValidator.validateItinerary(invalidData);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.end_date).toContain('after');
    });
    
    it('should enforce max trip duration of 365 days', () => {
      // Arrange
      const invalidData = {
        title: 'Test',
        start_date: '2024-01-01',
        end_date: '2025-12-31'
      };
      
      // Act
      const result = ItineraryValidator.validateItinerary(invalidData);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.end_date).toContain('365 days');
    });
    
    it('should allow partial data for updates', () => {
      // Arrange
      const updateData = {
        title: 'Updated Title'
      };
      
      // Act
      const result = ItineraryValidator.validateItinerary(updateData, true);
      
      // Assert
      expect(result.isValid).toBe(true);
    });
  });
  
  describe('validateItem', () => {
    it('should validate correct item data', () => {
      // Arrange
      const validData = {
        category: 'accommodation',
        title: 'Hotel Test',
        start_datetime: '2024-07-01T15:00:00Z',
        end_datetime: '2024-07-15T11:00:00Z',
        location: 'Test Location',
        confirmation_code: 'TEST-123'
      };
      
      // Act
      const result = ItineraryValidator.validateItem(validData);
      
      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toBeNull();
    });
    
    it('should require category', () => {
      // Arrange
      const invalidData = {
        title: 'Test Item'
      };
      
      // Act
      const result = ItineraryValidator.validateItem(invalidData);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBeDefined();
    });
    
    it('should validate category values', () => {
      // Arrange
      const invalidData = {
        category: 'invalid_category',
        title: 'Test Item'
      };
      
      // Act
      const result = ItineraryValidator.validateItem(invalidData);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toContain('accommodation');
    });
    
    it('should validate datetime range', () => {
      // Arrange
      const invalidData = {
        category: 'accommodation',
        title: 'Test',
        start_datetime: '2024-07-15T15:00:00Z',
        end_datetime: '2024-07-01T11:00:00Z'
      };
      
      // Act
      const result = ItineraryValidator.validateItem(invalidData);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.end_datetime).toContain('after');
    });
    
    it('should validate cost is positive', () => {
      // Arrange
      const invalidData = {
        category: 'accommodation',
        title: 'Test',
        cost: -100
      };
      
      // Act
      const result = ItineraryValidator.validateItem(invalidData);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.cost).toContain('positive');
    });
  });
});
