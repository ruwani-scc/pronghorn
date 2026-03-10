import { test, expect } from '@playwright/test';
import { createTestItinerary, createTestItem, cleanupTestData } from '../utils/test-data';
import { validateItemResponse, validateErrorResponse } from '../utils/validators';

test.describe('Items API', () => {
  let testItineraryId: number;
  let testItemId: number;

  test.beforeAll(async ({ request }) => {
    // Create a test itinerary for items
    const itinerary = await createTestItinerary(request);
    testItineraryId = itinerary.id;
  });

  test.afterAll(async ({ request }) => {
    // Cleanup test data
    await cleanupTestData(request, testItineraryId);
  });

  test.describe('POST /api/items - Create Item', () => {
    test('should create a new item successfully', async ({ request }) => {
      const itemData = {
        itineraryId: testItineraryId,
        name: 'Beach Hotel',
        type: 'Accommodation',
        description: 'Beachfront resort with ocean view',
        startDate: '2024-07-01T14:00:00Z',
        endDate: '2024-07-07T10:00:00Z',
        location: 'Waikiki Beach, Hawaii',
        cost: 1500.00,
        isPaid: false
      };

      const response = await request.post('/api/items', {
        data: itemData
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      
      validateItemResponse(body);
      expect(body.name).toBe(itemData.name);
      expect(body.type).toBe(itemData.type);
      expect(body.cost).toBe(itemData.cost);
      
      testItemId = body.id;
    });

    test('should create activity item', async ({ request }) => {
      const itemData = {
        itineraryId: testItineraryId,
        name: 'Surfing Lesson',
        type: 'Activity',
        description: 'Beginner surfing lesson',
        startDate: '2024-07-02T09:00:00Z',
        endDate: '2024-07-02T11:00:00Z',
        location: 'Waikiki Beach',
        cost: 75.00,
        isPaid: true
      };

      const response = await request.post('/api/items', {
        data: itemData
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.type).toBe('Activity');
    });

    test('should create transportation item', async ({ request }) => {
      const itemData = {
        itineraryId: testItineraryId,
        name: 'Flight to Hawaii',
        type: 'Transportation',
        description: 'Direct flight LAX to HNL',
        startDate: '2024-07-01T08:00:00Z',
        endDate: '2024-07-01T13:00:00Z',
        location: 'Los Angeles to Honolulu',
        cost: 450.00,
        isPaid: true
      };

      const response = await request.post('/api/items', {
        data: itemData
      });

      expect(response.status()).toBe(201);
    });

    test('should fail with missing required fields', async ({ request }) => {
      const itemData = {
        itineraryId: testItineraryId,
        name: 'Incomplete Item'
        // Missing type and other required fields
      };

      const response = await request.post('/api/items', {
        data: itemData
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      validateErrorResponse(body);
    });

    test('should fail with invalid item type', async ({ request }) => {
      const itemData = {
        itineraryId: testItineraryId,
        name: 'Invalid Item',
        type: 'InvalidType',
        startDate: '2024-07-01T14:00:00Z',
        endDate: '2024-07-07T10:00:00Z'
      };

      const response = await request.post('/api/items', {
        data: itemData
      });

      expect(response.status()).toBe(400);
    });

    test('should fail with invalid date range', async ({ request }) => {
      const itemData = {
        itineraryId: testItineraryId,
        name: 'Bad Dates',
        type: 'Accommodation',
        startDate: '2024-07-10T14:00:00Z',
        endDate: '2024-07-05T10:00:00Z' // End before start
      };

      const response = await request.post('/api/items', {
        data: itemData
      });

      expect(response.status()).toBe(400);
    });
  });

  test.describe('GET /api/items/{id} - Get Item', () => {
    test('should retrieve item by ID', async ({ request }) => {
      const response = await request.get(`/api/items/${testItemId}`);
      
      expect(response.status()).toBe(200);
      const body = await response.json();
      
      validateItemResponse(body);
      expect(body.id).toBe(testItemId);
    });

    test('should return 404 for non-existent item', async ({ request }) => {
      const response = await request.get('/api/items/999999');
      expect(response.status()).toBe(404);
    });

    test('should return 400 for invalid ID format', async ({ request }) => {
      const response = await request.get('/api/items/invalid-id');
      expect([400, 404]).toContain(response.status());
    });
  });

  test.describe('PUT /api/items/{id} - Update Item', () => {
    test('should update item successfully', async ({ request }) => {
      const updateData = {
        name: 'Updated Beach Hotel',
        description: 'Updated description',
        cost: 1600.00,
        isPaid: true
      };

      const response = await request.put(`/api/items/${testItemId}`, {
        data: updateData
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      
      expect(body.name).toBe(updateData.name);
      expect(body.cost).toBe(updateData.cost);
      expect(body.isPaid).toBe(true);
    });

    test('should partially update item', async ({ request }) => {
      const updateData = {
        isPaid: false
      };

      const response = await request.put(`/api/items/${testItemId}`, {
        data: updateData
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.isPaid).toBe(false);
    });

    test('should fail to update non-existent item', async ({ request }) => {
      const response = await request.put('/api/items/999999', {
        data: { name: 'Updated' }
      });
      
      expect(response.status()).toBe(404);
    });
  });

  test.describe('DELETE /api/items/{id} - Delete Item', () => {
    test('should delete item successfully', async ({ request }) => {
      // Create a new item to delete
      const itemData = await createTestItem(request, testItineraryId);
      
      const response = await request.delete(`/api/items/${itemData.id}`);
      expect([200, 204]).toContain(response.status());

      // Verify item is deleted
      const getResponse = await request.get(`/api/items/${itemData.id}`);
      expect(getResponse.status()).toBe(404);
    });

    test('should return 404 when deleting non-existent item', async ({ request }) => {
      const response = await request.delete('/api/items/999999');
      expect(response.status()).toBe(404);
    });
  });

  test.describe('GET /api/itineraries/{id}/items - List Items', () => {
    test('should list all items for an itinerary', async ({ request }) => {
      const response = await request.get(`/api/itineraries/${testItineraryId}/items`);
      
      expect(response.status()).toBe(200);
      const body = await response.json();
      
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBeGreaterThan(0);
      
      body.forEach((item: any) => {
        validateItemResponse(item);
        expect(item.itineraryId).toBe(testItineraryId);
      });
    });

    test('should return empty array for itinerary with no items', async ({ request }) => {
      const emptyItinerary = await createTestItinerary(request);
      const response = await request.get(`/api/itineraries/${emptyItinerary.id}/items`);
      
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBe(0);
      
      // Cleanup
      await request.delete(`/api/itineraries/${emptyItinerary.id}`);
    });
  });
});
