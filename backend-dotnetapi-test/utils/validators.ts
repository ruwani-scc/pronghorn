import { expect } from '@playwright/test';

/**
 * Validation utilities for API responses
 */

/**
 * Validate itinerary response structure
 */
export function validateItineraryResponse(itinerary: any): void {
  expect(itinerary).toBeDefined();
  expect(itinerary).toHaveProperty('id');
  expect(itinerary).toHaveProperty('name');
  expect(itinerary).toHaveProperty('destination');
  expect(itinerary).toHaveProperty('startDate');
  expect(itinerary).toHaveProperty('endDate');
  
  expect(typeof itinerary.id).toBe('number');
  expect(typeof itinerary.name).toBe('string');
  expect(typeof itinerary.destination).toBe('string');
  expect(itinerary.name.length).toBeGreaterThan(0);
  expect(itinerary.destination.length).toBeGreaterThan(0);
  
  // Validate dates
  validateDateString(itinerary.startDate);
  validateDateString(itinerary.endDate);
  
  // Start date should be before or equal to end date
  const start = new Date(itinerary.startDate);
  const end = new Date(itinerary.endDate);
  expect(start.getTime()).toBeLessThanOrEqual(end.getTime());
}

/**
 * Validate item response structure
 */
export function validateItemResponse(item: any): void {
  expect(item).toBeDefined();
  expect(item).toHaveProperty('id');
  expect(item).toHaveProperty('itineraryId');
  expect(item).toHaveProperty('name');
  expect(item).toHaveProperty('type');
  expect(item).toHaveProperty('startDate');
  expect(item).toHaveProperty('endDate');
  
  expect(typeof item.id).toBe('number');
  expect(typeof item.itineraryId).toBe('number');
  expect(typeof item.name).toBe('string');
  expect(typeof item.type).toBe('string');
  expect(item.name.length).toBeGreaterThan(0);
  
  // Validate item type
  const validTypes = ['Accommodation', 'Transportation', 'Activity'];
  expect(validTypes).toContain(item.type);
  
  // Validate dates
  validateDateString(item.startDate);
  validateDateString(item.endDate);
  
  // Start date should be before or equal to end date
  const start = new Date(item.startDate);
  const end = new Date(item.endDate);
  expect(start.getTime()).toBeLessThanOrEqual(end.getTime());
  
  // Validate optional fields if present
  if (item.cost !== undefined && item.cost !== null) {
    expect(typeof item.cost).toBe('number');
    expect(item.cost).toBeGreaterThanOrEqual(0);
  }
  
  if (item.isPaid !== undefined && item.isPaid !== null) {
    expect(typeof item.isPaid).toBe('boolean');
  }
  
  if (item.location !== undefined && item.location !== null) {
    expect(typeof item.location).toBe('string');
  }
  
  if (item.description !== undefined && item.description !== null) {
    expect(typeof item.description).toBe('string');
  }
}

/**
 * Validate error response structure
 */
export function validateErrorResponse(error: any): void {
  expect(error).toBeDefined();
  
  // Common error response patterns
  const hasErrors = error.errors !== undefined;
  const hasMessage = error.message !== undefined;
  const hasTitle = error.title !== undefined;
  
  expect(hasErrors || hasMessage || hasTitle).toBeTruthy();
  
  if (hasErrors) {
    expect(typeof error.errors).toBe('object');
  }
  
  if (hasMessage) {
    expect(typeof error.message).toBe('string');
    expect(error.message.length).toBeGreaterThan(0);
  }
}

/**
 * Validate date string format
 */
export function validateDateString(dateStr: string): void {
  expect(typeof dateStr).toBe('string');
  const date = new Date(dateStr);
  expect(date.toString()).not.toBe('Invalid Date');
  expect(date.getTime()).toBeGreaterThan(0);
}

/**
 * Validate pagination response
 */
export function validatePaginationResponse(response: any): void {
  expect(response).toBeDefined();
  
  if (Array.isArray(response)) {
    // Simple array response
    expect(response).toBeDefined();
  } else {
    // Paginated response with metadata
    expect(response).toHaveProperty('items');
    expect(Array.isArray(response.items)).toBeTruthy();
    
    if (response.totalCount !== undefined) {
      expect(typeof response.totalCount).toBe('number');
      expect(response.totalCount).toBeGreaterThanOrEqual(0);
    }
    
    if (response.page !== undefined) {
      expect(typeof response.page).toBe('number');
      expect(response.page).toBeGreaterThan(0);
    }
    
    if (response.pageSize !== undefined) {
      expect(typeof response.pageSize).toBe('number');
      expect(response.pageSize).toBeGreaterThan(0);
    }
  }
}

/**
 * Validate health check response
 */
export function validateHealthResponse(health: any): void {
  expect(health).toBeDefined();
  expect(health).toHaveProperty('status');
  expect(typeof health.status).toBe('string');
  
  const validStatuses = ['Healthy', 'Degraded', 'Unhealthy'];
  expect(validStatuses).toContain(health.status);
  
  if (health.timestamp) {
    validateDateString(health.timestamp);
  }
}

/**
 * Validate response headers
 */
export function validateResponseHeaders(headers: any): void {
  expect(headers).toBeDefined();
  expect(headers['content-type']).toBeDefined();
  expect(headers['content-type']).toContain('application/json');
}

/**
 * Validate array of items
 */
export function validateItemArray(items: any[]): void {
  expect(Array.isArray(items)).toBeTruthy();
  items.forEach(item => {
    validateItemResponse(item);
  });
}

/**
 * Validate array of itineraries
 */
export function validateItineraryArray(itineraries: any[]): void {
  expect(Array.isArray(itineraries)).toBeTruthy();
  itineraries.forEach(itinerary => {
    validateItineraryResponse(itinerary);
  });
}

/**
 * Validate cost values
 */
export function validateCost(cost: number): void {
  expect(typeof cost).toBe('number');
  expect(cost).toBeGreaterThanOrEqual(0);
  expect(Number.isFinite(cost)).toBeTruthy();
  // Cost should have at most 2 decimal places
  expect(cost).toBeCloseTo(Math.round(cost * 100) / 100, 2);
}

/**
 * Validate completeness percentage
 */
export function validateCompleteness(completeness: number): void {
  expect(typeof completeness).toBe('number');
  expect(completeness).toBeGreaterThanOrEqual(0);
  expect(completeness).toBeLessThanOrEqual(100);
}

/**
 * Custom matcher for response time
 */
export function validateResponseTime(startTime: number, endTime: number, maxMs: number): void {
  const duration = endTime - startTime;
  expect(duration).toBeLessThan(maxMs);
}
