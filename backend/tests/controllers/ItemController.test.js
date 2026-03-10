/**
 * ItemController Unit Tests
 * Tests for itinerary item CRUD operations
 */

const ItemController = require('../../controllers/ItemController');
const ItineraryValidator = require('../../utils/ItineraryValidator');
const db = require('../../config/database');

// Mock dependencies
jest.mock('../../utils/ItineraryValidator');
jest.mock('../../config/database');

describe('ItemController', () => {
  let mockReq, mockRes, mockNext;
  
  beforeEach(() => {
    mockReq = global.testUtils.createMockRequest({
      user: global.testUtils.mockUser
    });
    mockRes = global.testUtils.createMockResponse();
    mockNext = global.testUtils.createMockNext();
  });
  
  describe('listByItinerary', () => {
    it('should return all items for an itinerary', async () => {
      // Arrange
      const itineraryId = '323e4567-e89b-12d3-a456-426614174000';
      mockReq.params = { id: itineraryId };
      mockReq.query = {};
      
      const mockItems = [global.testUtils.mockItem];
      db.query.mockResolvedValue({ rows: mockItems });
      
      // Act
      await ItemController.listByItinerary(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockItems,
        count: mockItems.length
      });
    });
    
    it('should filter items by category', async () => {
      // Arrange
      const itineraryId = '323e4567-e89b-12d3-a456-426614174000';
      mockReq.params = { id: itineraryId };
      mockReq.query = { category: 'accommodation' };
      
      const accommodationItems = [
        { ...global.testUtils.mockItem, category: 'accommodation' }
      ];
      db.query.mockResolvedValue({ rows: accommodationItems });
      
      // Act
      await ItemController.listByItinerary(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: accommodationItems,
        count: accommodationItems.length
      });
    });
  });
  
  describe('create', () => {
    it('should create new item with valid data', async () => {
      // Arrange
      const itineraryId = '323e4567-e89b-12d3-a456-426614174000';
      mockReq.params = { id: itineraryId };
      mockReq.body = {
        category: 'activity',
        title: 'Test Activity',
        start_datetime: '2024-07-01T10:00:00Z',
        location: 'Test Location'
      };
      
      ItineraryValidator.validateItem.mockReturnValue({
        isValid: true,
        errors: null
      });
      
      const mockCreated = { ...global.testUtils.mockItem };
      db.query.mockResolvedValue({ rows: [mockCreated] });
      
      // Act
      await ItemController.create(mockReq, mockRes, mockNext);
      
      // Assert
      expect(ItineraryValidator.validateItem).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreated,
        message: 'Item created successfully'
      });
    });
    
    it('should return validation errors for invalid data', async () => {
      // Arrange
      mockReq.params = { id: '323e4567-e89b-12d3-a456-426614174000' };
      mockReq.body = { title: '' };
      
      const validationErrors = {
        category: 'Category is required',
        title: 'Title is required'
      };
      
      ItineraryValidator.validateItem.mockReturnValue({
        isValid: false,
        errors: validationErrors
      });
      
      // Act
      await ItemController.create(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        errors: validationErrors
      });
    });
  });
  
  describe('update', () => {
    it('should update item with valid data', async () => {
      // Arrange
      const itemId = '423e4567-e89b-12d3-a456-426614174000';
      mockReq.params = { id: itemId };
      mockReq.body = { title: 'Updated Title' };
      
      ItineraryValidator.validateItem.mockReturnValue({
        isValid: true,
        errors: null
      });
      
      const mockUpdated = { ...global.testUtils.mockItem, title: 'Updated Title' };
      db.query.mockResolvedValue({ rows: [mockUpdated] });
      
      // Act
      await ItemController.update(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdated,
        message: 'Item updated successfully'
      });
    });
  });
  
  describe('delete', () => {
    it('should delete item', async () => {
      // Arrange
      const itemId = '423e4567-e89b-12d3-a456-426614174000';
      mockReq.params = { id: itemId };
      
      db.query.mockResolvedValue({ rowCount: 1 });
      
      // Act
      await ItemController.delete(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Item deleted successfully'
      });
    });
  });
  
  describe('bulkOperation', () => {
    it('should handle reorder operation', async () => {
      // Arrange
      mockReq.body = {
        operation: 'reorder',
        items: [
          { id: 'item1', display_order: 0 },
          { id: 'item2', display_order: 1 }
        ]
      };
      
      db.query.mockResolvedValue({ rowCount: 2 });
      
      // Act
      await ItemController.bulkOperation(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Bulk reorder completed successfully',
        processed: 2
      });
    });
    
    it('should reject invalid bulk operation request', async () => {
      // Arrange
      mockReq.body = { operation: 'reorder' }; // Missing items array
      
      // Act
      await ItemController.bulkOperation(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid bulk operation request'
      });
    });
    
    it('should reject unknown operation', async () => {
      // Arrange
      mockReq.body = {
        operation: 'unknown_operation',
        items: []
      };
      
      // Act
      await ItemController.bulkOperation(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Unknown bulk operation'
      });
    });
  });
});
