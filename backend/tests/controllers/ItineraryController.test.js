/**
 * ItineraryController Unit Tests
 * Tests for itinerary CRUD operations
 */

const ItineraryController = require('../../controllers/ItineraryController');
const ItineraryValidator = require('../../utils/ItineraryValidator');
const db = require('../../config/database');

// Mock dependencies
jest.mock('../../utils/ItineraryValidator');
jest.mock('../../config/database');

describe('ItineraryController', () => {
  let mockReq, mockRes, mockNext;
  
  beforeEach(() => {
    // Create fresh mocks for each test
    mockReq = global.testUtils.createMockRequest({
      user: global.testUtils.mockUser
    });
    mockRes = global.testUtils.createMockResponse();
    mockNext = global.testUtils.createMockNext();
  });
  
  describe('list', () => {
    it('should return list of itineraries for authenticated user', async () => {
      // Arrange
      const mockItineraries = [global.testUtils.mockItinerary];
      db.query.mockResolvedValue({ rows: mockItineraries });
      
      // Act
      await ItineraryController.list(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockItineraries,
        count: mockItineraries.length
      });
    });
    
    it('should handle database errors', async () => {
      // Arrange
      const error = new Error('Database error');
      db.query.mockRejectedValue(error);
      
      // Act
      await ItineraryController.list(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('create', () => {
    it('should create new itinerary with valid data', async () => {
      // Arrange
      const itineraryData = {
        title: 'Test Vacation',
        destination: 'Test City',
        start_date: '2024-07-01',
        end_date: '2024-07-15',
        description: 'Test description'
      };
      mockReq.body = itineraryData;
      
      ItineraryValidator.validateItinerary.mockReturnValue({
        isValid: true,
        errors: null
      });
      
      const mockCreated = { ...global.testUtils.mockItinerary };
      db.query.mockResolvedValue({ rows: [mockCreated] });
      
      // Act
      await ItineraryController.create(mockReq, mockRes, mockNext);
      
      // Assert
      expect(ItineraryValidator.validateItinerary).toHaveBeenCalledWith(itineraryData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreated,
        message: 'Itinerary created successfully'
      });
    });
    
    it('should return validation errors for invalid data', async () => {
      // Arrange
      mockReq.body = { title: '' };
      
      const validationErrors = {
        title: 'Title is required',
        start_date: 'Start date is required'
      };
      
      ItineraryValidator.validateItinerary.mockReturnValue({
        isValid: false,
        errors: validationErrors
      });
      
      // Act
      await ItineraryController.create(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        errors: validationErrors
      });
    });
  });
  
  describe('read', () => {
    it('should return single itinerary by id', async () => {
      // Arrange
      const itineraryId = '323e4567-e89b-12d3-a456-426614174000';
      mockReq.params = { id: itineraryId };
      
      const mockItinerary = { ...global.testUtils.mockItinerary };
      db.query.mockResolvedValue({ rows: [mockItinerary] });
      
      // Act
      await ItineraryController.read(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockItinerary
      });
    });
  });
  
  describe('update', () => {
    it('should update itinerary with valid data', async () => {
      // Arrange
      const itineraryId = '323e4567-e89b-12d3-a456-426614174000';
      mockReq.params = { id: itineraryId };
      mockReq.body = { title: 'Updated Title' };
      
      ItineraryValidator.validateItinerary.mockReturnValue({
        isValid: true,
        errors: null
      });
      
      const mockUpdated = { ...global.testUtils.mockItinerary, title: 'Updated Title' };
      db.query.mockResolvedValue({ rows: [mockUpdated] });
      
      // Act
      await ItineraryController.update(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdated,
        message: 'Itinerary updated successfully'
      });
    });
  });
  
  describe('delete', () => {
    it('should delete itinerary', async () => {
      // Arrange
      const itineraryId = '323e4567-e89b-12d3-a456-426614174000';
      mockReq.params = { id: itineraryId };
      
      db.query.mockResolvedValue({ rowCount: 1 });
      
      // Act
      await ItineraryController.delete(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Itinerary deleted successfully'
      });
    });
  });
});
