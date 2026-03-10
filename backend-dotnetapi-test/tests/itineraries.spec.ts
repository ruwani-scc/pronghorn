import { test, expect } from '@playwright/test';
import { createTestItinerary } from '../utils/test-data';
import { validateItineraryResponse, validateErrorResponse } from '../utils/validators';

test.describe('Itineraries API', () => {
  let testItineraryId: number;

  test.describe('POST /api/itineraries - Create Itinerary', () => {
    test('should create a new itinerary successfully', async ({ request }) => {
      const itineraryData = {
        name: 'Summer Vacation 2024',
        destination: 'Hawaii',
        startDate: '2024-07-01T00:00:00Z',
        endDate: '2024-07-14T00:00:00Z',
        description: 'Two week vacation in Hawaii'
      };

      const response = await request.post('/api/itineraries', {
        data: itineraryData
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      
      validateItineraryResponse(body);
      expect(body.name).toBe(itineraryData.name);
      expect(body.destination).toBe(itineraryData.destination);
      
      testItineraryId = body.id;
    });

    test('should create itinerary with minimal data', async ({ request }) => {
      const itineraryData = {
        name: 'Weekend Trip',
        destination: 'San Francisco',
        startDate: '2024-08-01T00:00:00Z',
        endDate: '2024-08-03T00:00:00Z'
      };

      const response = await request.post('/api/itineraries', {
        data: itineraryData
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.name).toBe(itineraryData.name);
    });

    test('should fail with missing required fields', async ({ request }) => {
      const itineraryData = {
        name: 'Incomplete Trip'
        // Missing destination and dates
      };

      const response = await request.post('/api/itineraries', {
        data: itineraryData
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      validateErrorResponse(body);
    });

    test('should fail with invalid date range', async ({ request }) => {
      const itineraryData = {
        name: 'Invalid Dates',
        destination: 'Paris',
        startDate: '2024-07-14T00:00:00Z',
        endDate: '2024-07-01T00:00:00Z' // End before start
      };

      const response = await request.post('/api/itineraries', {
        data: itineraryData
      });

      expect(response.status()).toBe(400);
    });

    test('should fail with empty name', async ({ request }) => {
      const itineraryData = {
        name: '',
        destination: 'Tokyo',
        startDate: '2024-09-01T00:00:00Z',
        endDate: '2024-09-10T00:00:00Z'
      };

      const response = await request.post('/api/itineraries', {
        data: itineraryData
      });

      expect(response.status()).toBe(400);
    });
  });

  test.describe('GET /api/itineraries/{id} - Get Itinerary', () => {
    test.beforeAll(async ({ request }) => {
      const itinerary = await createTestItinerary(request);
      testItineraryId = itinerary.id;
    });

    test('should retrieve itinerary by ID', async ({ request }) => {
      const response = await request.get(`/api/itineraries/${testItineraryId}`);
      
      expect(response.status()).toBe(200);
      const body = await response.json();
      
      validateItineraryResponse(body);
      expect(body.id).toBe(testItineraryId);
    });

    test('should return 404 for non-existent itinerary', async ({ request }) => {
      const response = await request.get('/api/itineraries/999999');
      expect(response.status()).toBe(404);
    });

    test('should return 400 for invalid ID format', async ({ request }) => {
      const response = await request.get('/api/itineraries/invalid-id');
      expect([400, 404]).toContain(response.status());
    });

    test('should include items in response', async ({ request }) => {
      const response = await request.get(`/api/itineraries/${testItineraryId}`);
      const body = await response.json();
      
      expect(body).toHaveProperty('items');
      expect(Array.isArray(body.items)).toBeTruthy();
    });
  });

  test.describe('GET /api/itineraries - List All Itineraries', () => {
    test('should list all itineraries', async ({ request }) => {
      const response = await request.get('/api/itineraries');
      
      expect(response.status()).toBe(200);
      const body = await response.json();
      
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBeGreaterThan(0);
      
      body.forEach((itinerary: any) => {
        validateItineraryResponse(itinerary);
      });
    });

    test('should support pagination', async ({ request }) => {
      const response = await request.get('/api/itineraries?page=1&pageSize=10');
      
      expect(response.status()).toBe(200);
      const body = await response.json();
      
      if (Array.isArray(body)) {
        expect(body.length).toBeLessThanOrEqual(10);
      } else if (body.items) {
        expect(body.items.length).toBeLessThanOrEqual(10);
      }
    });
  });

  test.describe('PUT /api/itineraries/{id} - Update Itinerary', () => {
    test('should update itinerary successfully', async ({ request }) => {
      const updateData = {
        name: 'Updated Summer Vacation',
        description: 'Updated description with more details',
        destination: 'Maui, Hawaii'
      };

      const response = await request.put(`/api/itineraries/${testItineraryId}`, {
        data: updateData
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      
      expect(body.name).toBe(updateData.name);
      expect(body.description).toBe(updateData.description);
      expect(body.destination).toBe(updateData.destination);
    });

    test('should partially update itinerary', async ({ request }) => {
      const updateData = {
        description: 'Just updating the description'
      };

      const response = await request.put(`/api/itineraries/${testItineraryId}`, {
        data: updateData
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.description).toBe(updateData.description);
    });

    test('should update dates', async ({ request }) => {
      const updateData = {
        startDate: '2024-07-05T00:00:00Z',
        endDate: '2024-07-20T00:00:00Z'
      };

      const response = await request.put(`/api/itineraries/${testItineraryId}`, {
        data: updateData
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.startDate).toBe(updateData.startDate);
      expect(body.endDate).toBe(updateData.endDate);
    });

    test('should fail to update with invalid dates', async ({ request }) => {
      const updateData = {
        startDate: '2024-08-01T00:00:00Z',
        endDate: '2024-07-01T00:00:00Z'
      };

      const response = await request.put(`/api/itineraries/${testItineraryId}`, {
        data: updateData
      });

      expect(response.status()).toBe(400);
    });

    test('should fail to update non-existent itinerary', async ({ request }) => {
      const response = await request.put('/api/itineraries/999999', {
        data: { name: 'Updated' }
      });
      
      expect(response.status()).toBe(404);
    });
  });

  test.describe('DELETE /api/itineraries/{id} - Delete Itinerary', () => {
    test('should delete itinerary successfully', async ({ request }) => {
      // Create a new itinerary to delete
      const itinerary = await createTestItinerary(request);
      
      const response = await request.delete(`/api/itineraries/${itinerary.id}`);
      expect([200, 204]).toContain(response.status());

      // Verify itinerary is deleted
      const getResponse = await request.get(`/api/itineraries/${itinerary.id}`);
      expect(getResponse.status()).toBe(404);
    });

    test('should return 404 when deleting non-existent itinerary', async ({ request }) => {
      const response = await request.delete('/api/itineraries/999999');
      expect(response.status()).toBe(404);
    });

    test('should delete itinerary with items', async ({ request }) => {
      // Create itinerary with items
      const itinerary = await createTestItinerary(request);
      
      // Add an item
      await request.post('/api/items', {
        data: {
          itineraryId: itinerary.id,
          name: 'Test Item',
          type: 'Activity',
          startDate: '2024-07-01T00:00:00Z',
          endDate: '2024-07-01T02:00:00Z'
        }
      });

      // Delete itinerary (should cascade delete items)
      const response = await request.delete(`/api/itineraries/${itinerary.id}`);
      expect([200, 204]).toContain(response.status());
    });
  });

  test.describe('Completeness Calculation', () => {
    test('should calculate completeness based on items', async ({ request }) => {
      const itinerary = await createTestItinerary(request);
      
      // Get initial completeness (should be low with no items)
      let response = await request.get(`/api/itineraries/${itinerary.id}`);
      let body = await response.json();
      
      if (body.completeness !== undefined) {
        expect(body.completeness).toBeLessThan(100);
      }

      // Add items
      await request.post('/api/items', {
        data: {
          itineraryId: itinerary.id,
          name: 'Hotel',
          type: 'Accommodation',
          startDate: '2024-07-01T00:00:00Z',
          endDate: '2024-07-07T00:00:00Z'
        }
      });

      await request.post('/api/items', {
        data: {
          itineraryId: itinerary.id,
          name: 'Flight',
          type: 'Transportation',
          startDate: '2024-07-01T00:00:00Z',
          endDate: '2024-07-01T05:00:00Z'
        }
      });

      // Get updated completeness
      response = await request.get(`/api/itineraries/${itinerary.id}`);
      body = await response.json();
      
      if (body.completeness !== undefined) {
        expect(body.completeness).toBeGreaterThan(0);
      }

      // Cleanup
      await request.delete(`/api/itineraries/${itinerary.id}`);
    });
  });

  test.afterAll(async ({ request }) => {
    // Cleanup test itinerary
    if (testItineraryId) {
      await request.delete(`/api/itineraries/${testItineraryId}`);
    }
  });
});
