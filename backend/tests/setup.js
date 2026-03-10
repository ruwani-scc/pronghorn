/**
 * Jest Test Setup
 * Global setup and teardown for tests
 * Mock configurations and test utilities
 */

// Load environment variables for testing
require('dotenv').config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock database for unit tests
jest.mock('../config/database', () => ({
  query: jest.fn(),
  getClient: jest.fn(),
  transaction: jest.fn(),
  testConnection: jest.fn(),
  close: jest.fn()
}));

// Global test utilities
global.testUtils = {
  /**
   * Create mock request object
   */
  createMockRequest: (overrides = {}) => {
    return {
      body: {},
      params: {},
      query: {},
      headers: {},
      user: null,
      ...overrides
    };
  },
  
  /**
   * Create mock response object
   */
  createMockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  },
  
  /**
   * Create mock next function
   */
  createMockNext: () => jest.fn(),
  
  /**
   * Mock authenticated user
   */
  mockUser: {
    id: '123e4567-e89b-12d3-a456-426614174999',
    email: 'test@example.com',
    auth_provider_id: 'auth0|test123'
  },
  
  /**
   * Mock itinerary data
   */
  mockItinerary: {
    id: '323e4567-e89b-12d3-a456-426614174000',
    user_id: '123e4567-e89b-12d3-a456-426614174999',
    title: 'Test Vacation',
    destination: 'Test City',
    start_date: '2024-07-01',
    end_date: '2024-07-15',
    description: 'Test description',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  
  /**
   * Mock item data
   */
  mockItem: {
    id: '423e4567-e89b-12d3-a456-426614174000',
    itinerary_id: '323e4567-e89b-12d3-a456-426614174000',
    category: 'accommodation',
    title: 'Test Hotel',
    description: 'Test hotel description',
    start_datetime: '2024-07-01T15:00:00Z',
    end_datetime: '2024-07-15T11:00:00Z',
    location: 'Test Location',
    confirmation_code: 'TEST-123',
    cost: 100.00,
    currency: 'USD',
    metadata: {},
    display_order: 0,
    is_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};

// Console suppression for cleaner test output
if (process.env.SUPPRESS_TEST_LOGS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}

// Global beforeEach
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Global afterAll
afterAll(async () => {
  // Close any open connections
  await new Promise(resolve => setTimeout(resolve, 500));
});
