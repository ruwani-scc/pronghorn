import { APIRequestContext } from '@playwright/test';
import { ItineraryData, ItemData, createItinerary, createItem, deleteItinerary } from './api-helpers';

/**
 * Test data generators and cleanup utilities
 */

let testDataRegistry: { itineraries: number[]; items: number[] } = {
  itineraries: [],
  items: []
};

/**
 * Generate a unique test name with timestamp
 */
export function generateTestName(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Create a test itinerary with default values
 */
export async function createTestItinerary(
  request: APIRequestContext,
  overrides?: Partial<Omit<ItineraryData, 'id'>>
): Promise<ItineraryData> {
  const defaultData: Omit<ItineraryData, 'id'> = {
    name: generateTestName('Test Itinerary'),
    destination: 'Test Destination',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-07-14T00:00:00Z',
    description: 'Auto-generated test itinerary'
  };

  const data = { ...defaultData, ...overrides };
  const itinerary = await createItinerary(request, data);
  
  // Register for cleanup
  if (itinerary.id) {
    testDataRegistry.itineraries.push(itinerary.id);
  }
  
  return itinerary;
}

/**
 * Create a test item with default values
 */
export async function createTestItem(
  request: APIRequestContext,
  itineraryId: number,
  overrides?: Partial<Omit<ItemData, 'id' | 'itineraryId'>>
): Promise<ItemData> {
  const defaultData: Omit<ItemData, 'id'> = {
    itineraryId,
    name: generateTestName('Test Item'),
    type: 'Activity',
    description: 'Auto-generated test item',
    startDate: '2024-07-02T10:00:00Z',
    endDate: '2024-07-02T12:00:00Z',
    location: 'Test Location',
    cost: 100.00,
    isPaid: false
  };

  const data = { ...defaultData, ...overrides };
  const item = await createItem(request, data);
  
  // Register for cleanup
  if (item.id) {
    testDataRegistry.items.push(item.id);
  }
  
  return item;
}

/**
 * Create multiple test items for an itinerary
 */
export async function createTestItems(
  request: APIRequestContext,
  itineraryId: number,
  count: number = 3
): Promise<ItemData[]> {
  const items: ItemData[] = [];
  
  const types: Array<'Accommodation' | 'Transportation' | 'Activity'> = [
    'Accommodation',
    'Transportation',
    'Activity'
  ];
  
  for (let i = 0; i < count; i++) {
    const item = await createTestItem(request, itineraryId, {
      name: `Test Item ${i + 1}`,
      type: types[i % types.length],
      cost: (i + 1) * 100
    });
    items.push(item);
  }
  
  return items;
}

/**
 * Create a complete test itinerary with items
 */
export async function createCompleteTestItinerary(
  request: APIRequestContext,
  itemCount: number = 3
): Promise<{ itinerary: ItineraryData; items: ItemData[] }> {
  const itinerary = await createTestItinerary(request);
  const items = await createTestItems(request, itinerary.id!, itemCount);
  
  return { itinerary, items };
}

/**
 * Test data templates
 */
export const testDataTemplates = {
  itinerary: {
    weekend: {
      name: 'Weekend Getaway',
      destination: 'San Francisco',
      startDate: '2024-08-01T00:00:00Z',
      endDate: '2024-08-03T00:00:00Z',
      description: 'Quick weekend trip'
    },
    weeklong: {
      name: 'Week Vacation',
      destination: 'Hawaii',
      startDate: '2024-07-01T00:00:00Z',
      endDate: '2024-07-08T00:00:00Z',
      description: 'One week vacation'
    },
    extended: {
      name: 'Extended Travel',
      destination: 'Europe Tour',
      startDate: '2024-09-01T00:00:00Z',
      endDate: '2024-09-30T00:00:00Z',
      description: 'Month-long European tour'
    }
  },
  
  item: {
    accommodation: {
      name: 'Hotel Stay',
      type: 'Accommodation' as const,
      description: 'Comfortable hotel in city center',
      startDate: '2024-07-01T14:00:00Z',
      endDate: '2024-07-07T11:00:00Z',
      location: 'Downtown',
      cost: 1000.00,
      isPaid: true
    },
    flight: {
      name: 'Round Trip Flight',
      type: 'Transportation' as const,
      description: 'Direct flight',
      startDate: '2024-07-01T08:00:00Z',
      endDate: '2024-07-01T13:00:00Z',
      location: 'Airport',
      cost: 500.00,
      isPaid: true
    },
    activity: {
      name: 'City Tour',
      type: 'Activity' as const,
      description: 'Guided walking tour',
      startDate: '2024-07-02T09:00:00Z',
      endDate: '2024-07-02T12:00:00Z',
      location: 'City Center',
      cost: 50.00,
      isPaid: false
    }
  }
};

/**
 * Cleanup a specific itinerary and its items
 */
export async function cleanupTestData(
  request: APIRequestContext,
  itineraryId: number
): Promise<void> {
  try {
    await deleteItinerary(request, itineraryId);
    // Remove from registry
    testDataRegistry.itineraries = testDataRegistry.itineraries.filter(id => id !== itineraryId);
  } catch (error) {
    console.error(`Failed to cleanup itinerary ${itineraryId}:`, error);
  }
}

/**
 * Cleanup all registered test data
 */
export async function cleanupAllTestData(request: APIRequestContext): Promise<void> {
  console.log(`Cleaning up ${testDataRegistry.itineraries.length} test itineraries...`);
  
  for (const itineraryId of testDataRegistry.itineraries) {
    await cleanupTestData(request, itineraryId);
  }
  
  // Reset registry
  testDataRegistry = { itineraries: [], items: [] };
}

/**
 * Get the test data registry (for debugging)
 */
export function getTestDataRegistry() {
  return { ...testDataRegistry };
}

/**
 * Clear the test data registry without cleanup
 */
export function clearTestDataRegistry(): void {
  testDataRegistry = { itineraries: [], items: [] };
}

/**
 * Generate random test data
 */
export const randomData = {
  destination: (): string => {
    const destinations = [
      'Paris, France',
      'Tokyo, Japan',
      'New York, USA',
      'London, UK',
      'Barcelona, Spain',
      'Rome, Italy',
      'Sydney, Australia',
      'Dubai, UAE',
      'Bangkok, Thailand',
      'Singapore'
    ];
    return destinations[Math.floor(Math.random() * destinations.length)];
  },
  
  cost: (min: number = 50, max: number = 1000): number => {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  },
  
  date: (daysFromNow: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
  },
  
  dateRange: (startDays: number, durationDays: number): { start: string; end: string } => {
    return {
      start: randomData.date(startDays),
      end: randomData.date(startDays + durationDays)
    };
  }
};
