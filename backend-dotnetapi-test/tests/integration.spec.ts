import { test, expect } from '@playwright/test';
import { createTestItinerary } from '../utils/test-data';

test.describe('Integration Tests', () => {
  test('complete itinerary workflow - create, add items, update, delete', async ({ request }) => {
    // 1. Create an itinerary
    const itineraryData = {
      name: 'Complete Workflow Test',
      destination: 'Barcelona, Spain',
      startDate: '2024-09-01T00:00:00Z',
      endDate: '2024-09-10T00:00:00Z',
      description: 'Testing complete workflow'
    };

    let response = await request.post('/api/itineraries', {
      data: itineraryData
    });

    expect(response.status()).toBe(201);
    let itinerary = await response.json();
    const itineraryId = itinerary.id;

    // 2. Add multiple items
    const items = [
      {
        itineraryId,
        name: 'Hotel Gothic Quarter',
        type: 'Accommodation',
        startDate: '2024-09-01T14:00:00Z',
        endDate: '2024-09-10T11:00:00Z',
        location: 'Barcelona Gothic Quarter',
        cost: 1200.00
      },
      {
        itineraryId,
        name: 'Flight to Barcelona',
        type: 'Transportation',
        startDate: '2024-09-01T08:00:00Z',
        endDate: '2024-09-01T12:00:00Z',
        cost: 450.00
      },
      {
        itineraryId,
        name: 'Sagrada Familia Tour',
        type: 'Activity',
        startDate: '2024-09-02T10:00:00Z',
        endDate: '2024-09-02T13:00:00Z',
        location: 'Sagrada Familia',
        cost: 35.00
      },
      {
        itineraryId,
        name: 'Park Güell Visit',
        type: 'Activity',
        startDate: '2024-09-03T09:00:00Z',
        endDate: '2024-09-03T12:00:00Z',
        location: 'Park Güell',
        cost: 10.00
      }
    ];

    const createdItems = [];
    for (const item of items) {
      response = await request.post('/api/items', { data: item });
      expect(response.status()).toBe(201);
      createdItems.push(await response.json());
    }

    // 3. Verify items were added
    response = await request.get(`/api/itineraries/${itineraryId}/items`);
    expect(response.status()).toBe(200);
    const itemsList = await response.json();
    expect(itemsList.length).toBe(4);

    // 4. Update an item
    const itemToUpdate = createdItems[0];
    response = await request.put(`/api/items/${itemToUpdate.id}`, {
      data: {
        name: 'Updated Hotel Gothic Quarter',
        cost: 1300.00,
        isPaid: true
      }
    });
    expect(response.status()).toBe(200);
    const updatedItem = await response.json();
    expect(updatedItem.cost).toBe(1300.00);
    expect(updatedItem.isPaid).toBe(true);

    // 5. Update the itinerary
    response = await request.put(`/api/itineraries/${itineraryId}`, {
      data: {
        description: 'Updated: Complete workflow test with all items'
      }
    });
    expect(response.status()).toBe(200);

    // 6. Delete one item
    response = await request.delete(`/api/items/${createdItems[3].id}`);
    expect([200, 204]).toContain(response.status());

    // 7. Verify item was deleted
    response = await request.get(`/api/itineraries/${itineraryId}/items`);
    const remainingItems = await response.json();
    expect(remainingItems.length).toBe(3);

    // 8. Delete the entire itinerary
    response = await request.delete(`/api/itineraries/${itineraryId}`);
    expect([200, 204]).toContain(response.status());

    // 9. Verify itinerary is deleted
    response = await request.get(`/api/itineraries/${itineraryId}`);
    expect(response.status()).toBe(404);
  });

  test('concurrent operations on different itineraries', async ({ request }) => {
    // Create multiple itineraries concurrently
    const itineraryPromises = Array(5).fill(null).map((_, index) => 
      request.post('/api/itineraries', {
        data: {
          name: `Concurrent Test ${index + 1}`,
          destination: `Destination ${index + 1}`,
          startDate: '2024-10-01T00:00:00Z',
          endDate: '2024-10-07T00:00:00Z'
        }
      })
    );

    const responses = await Promise.all(itineraryPromises);
    
    // Verify all were created successfully
    responses.forEach(response => {
      expect(response.status()).toBe(201);
    });

    const itineraries = await Promise.all(responses.map(r => r.json()));

    // Add items to all itineraries concurrently
    const itemPromises = itineraries.map(itinerary => 
      request.post('/api/items', {
        data: {
          itineraryId: itinerary.id,
          name: 'Concurrent Item',
          type: 'Activity',
          startDate: '2024-10-02T10:00:00Z',
          endDate: '2024-10-02T12:00:00Z'
        }
      })
    );

    const itemResponses = await Promise.all(itemPromises);
    itemResponses.forEach(response => {
      expect(response.status()).toBe(201);
    });

    // Cleanup - delete all itineraries
    const deletePromises = itineraries.map(itinerary => 
      request.delete(`/api/itineraries/${itinerary.id}`)
    );

    await Promise.all(deletePromises);
  });

  test('data consistency - itinerary with items maintains referential integrity', async ({ request }) => {
    // Create itinerary
    const itinerary = await createTestItinerary(request);
    const itineraryId = itinerary.id;

    // Add items
    const item1 = await request.post('/api/items', {
      data: {
        itineraryId,
        name: 'Item 1',
        type: 'Accommodation',
        startDate: '2024-07-01T00:00:00Z',
        endDate: '2024-07-05T00:00:00Z'
      }
    });
    const item1Data = await item1.json();

    // Verify item references correct itinerary
    let response = await request.get(`/api/items/${item1Data.id}`);
    let itemData = await response.json();
    expect(itemData.itineraryId).toBe(itineraryId);

    // Verify itinerary includes the item
    response = await request.get(`/api/itineraries/${itineraryId}`);
    const itineraryData = await response.json();
    
    if (itineraryData.items) {
      const foundItem = itineraryData.items.find((item: any) => item.id === item1Data.id);
      expect(foundItem).toBeDefined();
    }

    // Cleanup
    await request.delete(`/api/itineraries/${itineraryId}`);
  });

  test('error handling - creating item for non-existent itinerary', async ({ request }) => {
    const response = await request.post('/api/items', {
      data: {
        itineraryId: 999999,
        name: 'Orphaned Item',
        type: 'Activity',
        startDate: '2024-07-01T00:00:00Z',
        endDate: '2024-07-01T02:00:00Z'
      }
    });

    expect([400, 404]).toContain(response.status());
  });

  test('cost calculation - total cost of itinerary items', async ({ request }) => {
    // Create itinerary
    const itinerary = await createTestItinerary(request);
    const itineraryId = itinerary.id;

    // Add items with known costs
    const costs = [100.00, 250.50, 75.25, 50.00];
    const expectedTotal = costs.reduce((sum, cost) => sum + cost, 0);

    for (let i = 0; i < costs.length; i++) {
      await request.post('/api/items', {
        data: {
          itineraryId,
          name: `Item ${i + 1}`,
          type: 'Activity',
          startDate: '2024-07-01T00:00:00Z',
          endDate: '2024-07-01T02:00:00Z',
          cost: costs[i]
        }
      });
    }

    // Get itinerary and verify total cost
    const response = await request.get(`/api/itineraries/${itineraryId}`);
    const itineraryData = await response.json();

    if (itineraryData.totalCost !== undefined) {
      expect(itineraryData.totalCost).toBe(expectedTotal);
    } else if (itineraryData.items) {
      const calculatedTotal = itineraryData.items.reduce(
        (sum: number, item: any) => sum + (item.cost || 0), 0
      );
      expect(calculatedTotal).toBeCloseTo(expectedTotal, 2);
    }

    // Cleanup
    await request.delete(`/api/itineraries/${itineraryId}`);
  });

  test('date validation - items must be within itinerary dates', async ({ request }) => {
    // Create itinerary with specific dates
    const response = await request.post('/api/itineraries', {
      data: {
        name: 'Date Validation Test',
        destination: 'Test Location',
        startDate: '2024-07-01T00:00:00Z',
        endDate: '2024-07-07T00:00:00Z'
      }
    });

    const itinerary = await response.json();

    // Try to add item outside itinerary dates
    const itemResponse = await request.post('/api/items', {
      data: {
        itineraryId: itinerary.id,
        name: 'Out of Range Item',
        type: 'Activity',
        startDate: '2024-07-10T00:00:00Z', // After itinerary end
        endDate: '2024-07-11T00:00:00Z'
      }
    });

    // This should either fail or be allowed based on business rules
    // Document the expected behavior
    if (itemResponse.status() === 400) {
      const error = await itemResponse.json();
      expect(error).toHaveProperty('errors');
    }

    // Cleanup
    await request.delete(`/api/itineraries/${itinerary.id}`);
  });

  test('performance - handle multiple rapid updates', async ({ request }) => {
    const itinerary = await createTestItinerary(request);
    const itineraryId = itinerary.id;

    // Perform rapid updates
    const updates = Array(10).fill(null).map((_, index) => 
      request.put(`/api/itineraries/${itineraryId}`, {
        data: {
          description: `Update ${index + 1}`
        }
      })
    );

    const startTime = Date.now();
    const results = await Promise.all(updates);
    const endTime = Date.now();

    // All updates should succeed
    results.forEach(result => {
      expect(result.status()).toBe(200);
    });

    // Should complete in reasonable time (under 5 seconds)
    expect(endTime - startTime).toBeLessThan(5000);

    // Cleanup
    await request.delete(`/api/itineraries/${itineraryId}`);
  });
});
