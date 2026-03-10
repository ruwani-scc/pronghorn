import { APIRequestContext } from '@playwright/test';

/**
 * API Helper functions for VacationPlan API testing
 */

export interface ItineraryData {
  id?: number;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  items?: ItemData[];
  totalCost?: number;
  completeness?: number;
}

export interface ItemData {
  id?: number;
  itineraryId: number;
  name: string;
  type: 'Accommodation' | 'Transportation' | 'Activity';
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  cost?: number;
  isPaid?: boolean;
}

/**
 * Create an itinerary
 */
export async function createItinerary(
  request: APIRequestContext,
  data: Omit<ItineraryData, 'id'>
): Promise<ItineraryData> {
  const response = await request.post('/api/itineraries', { data });
  
  if (!response.ok()) {
    throw new Error(`Failed to create itinerary: ${response.status()} ${await response.text()}`);
  }
  
  return await response.json();
}

/**
 * Get an itinerary by ID
 */
export async function getItinerary(
  request: APIRequestContext,
  id: number
): Promise<ItineraryData> {
  const response = await request.get(`/api/itineraries/${id}`);
  
  if (!response.ok()) {
    throw new Error(`Failed to get itinerary: ${response.status()} ${await response.text()}`);
  }
  
  return await response.json();
}

/**
 * Get all itineraries
 */
export async function getAllItineraries(
  request: APIRequestContext,
  params?: { page?: number; pageSize?: number }
): Promise<ItineraryData[]> {
  let url = '/api/itineraries';
  
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }
  
  const response = await request.get(url);
  
  if (!response.ok()) {
    throw new Error(`Failed to get itineraries: ${response.status()} ${await response.text()}`);
  }
  
  return await response.json();
}

/**
 * Update an itinerary
 */
export async function updateItinerary(
  request: APIRequestContext,
  id: number,
  data: Partial<ItineraryData>
): Promise<ItineraryData> {
  const response = await request.put(`/api/itineraries/${id}`, { data });
  
  if (!response.ok()) {
    throw new Error(`Failed to update itinerary: ${response.status()} ${await response.text()}`);
  }
  
  return await response.json();
}

/**
 * Delete an itinerary
 */
export async function deleteItinerary(
  request: APIRequestContext,
  id: number
): Promise<void> {
  const response = await request.delete(`/api/itineraries/${id}`);
  
  if (!response.ok() && response.status() !== 204) {
    throw new Error(`Failed to delete itinerary: ${response.status()} ${await response.text()}`);
  }
}

/**
 * Create an item
 */
export async function createItem(
  request: APIRequestContext,
  data: Omit<ItemData, 'id'>
): Promise<ItemData> {
  const response = await request.post('/api/items', { data });
  
  if (!response.ok()) {
    throw new Error(`Failed to create item: ${response.status()} ${await response.text()}`);
  }
  
  return await response.json();
}

/**
 * Get an item by ID
 */
export async function getItem(
  request: APIRequestContext,
  id: number
): Promise<ItemData> {
  const response = await request.get(`/api/items/${id}`);
  
  if (!response.ok()) {
    throw new Error(`Failed to get item: ${response.status()} ${await response.text()}`);
  }
  
  return await response.json();
}

/**
 * Get all items for an itinerary
 */
export async function getItineraryItems(
  request: APIRequestContext,
  itineraryId: number
): Promise<ItemData[]> {
  const response = await request.get(`/api/itineraries/${itineraryId}/items`);
  
  if (!response.ok()) {
    throw new Error(`Failed to get itinerary items: ${response.status()} ${await response.text()}`);
  }
  
  return await response.json();
}

/**
 * Update an item
 */
export async function updateItem(
  request: APIRequestContext,
  id: number,
  data: Partial<ItemData>
): Promise<ItemData> {
  const response = await request.put(`/api/items/${id}`, { data });
  
  if (!response.ok()) {
    throw new Error(`Failed to update item: ${response.status()} ${await response.text()}`);
  }
  
  return await response.json();
}

/**
 * Delete an item
 */
export async function deleteItem(
  request: APIRequestContext,
  id: number
): Promise<void> {
  const response = await request.delete(`/api/items/${id}`);
  
  if (!response.ok() && response.status() !== 204) {
    throw new Error(`Failed to delete item: ${response.status()} ${await response.text()}`);
  }
}

/**
 * Check health status
 */
export async function checkHealth(
  request: APIRequestContext
): Promise<{ status: string; timestamp?: string }> {
  const response = await request.get('/health');
  
  if (!response.ok()) {
    throw new Error(`Health check failed: ${response.status()} ${await response.text()}`);
  }
  
  return await response.json();
}

/**
 * Wait for API to be ready
 */
export async function waitForApiReady(
  request: APIRequestContext,
  maxAttempts: number = 30,
  delayMs: number = 1000
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await checkHealth(request);
      return true;
    } catch (error) {
      if (i === maxAttempts - 1) {
        throw new Error(`API not ready after ${maxAttempts} attempts`);
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  return false;
}
