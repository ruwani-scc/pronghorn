/**
 * API Helper Utilities for E2E Tests
 * Functions for interacting with and mocking API endpoints
 */

import { Page, Route, Request } from '@playwright/test';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  status: string;
  budget?: number;
  currency?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mock successful itinerary creation
 */
export async function mockCreateItinerarySuccess(
  page: Page,
  itineraryData: Partial<Itinerary>
): Promise<void> {
  await page.route('**/api/v1/itineraries', async (route: Route) => {
    if (route.request().method() === 'POST') {
      const mockItinerary: Itinerary = {
        id: generateMockId(),
        title: itineraryData.title || 'Mock Trip',
        destination: itineraryData.destination || 'Mock City',
        startDate: itineraryData.startDate || '2024-07-01',
        endDate: itineraryData.endDate || '2024-07-15',
        description: itineraryData.description,
        status: itineraryData.status || 'draft',
        budget: itineraryData.budget,
        currency: itineraryData.currency || 'USD',
        userId: 'mock-user-123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockItinerary,
        } as APIResponse<Itinerary>),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock itinerary creation failure
 */
export async function mockCreateItineraryFailure(
  page: Page,
  statusCode: number = 400,
  errorMessage: string = 'Validation failed'
): Promise<void> {
  await page.route('**/api/v1/itineraries', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: errorMessage,
          errors: [errorMessage],
        } as APIResponse),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock get all itineraries
 */
export async function mockGetAllItineraries(
  page: Page,
  itineraries: Itinerary[]
): Promise<void> {
  await page.route('**/api/v1/itineraries', async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            data: itineraries,
            count: itineraries.length,
          },
        } as APIResponse),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock get single itinerary
 */
export async function mockGetItineraryById(
  page: Page,
  itinerary: Itinerary
): Promise<void> {
  await page.route(`**/api/v1/itineraries/${itinerary.id}`, async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: itinerary,
        } as APIResponse<Itinerary>),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock itinerary not found
 */
export async function mockItineraryNotFound(
  page: Page,
  itineraryId: string
): Promise<void> {
  await page.route(`**/api/v1/itineraries/${itineraryId}`, async (route: Route) => {
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        message: 'Itinerary not found',
      } as APIResponse),
    });
  });
}

/**
 * Mock update itinerary
 */
export async function mockUpdateItinerary(
  page: Page,
  itinerary: Itinerary
): Promise<void> {
  await page.route(`**/api/v1/itineraries/${itinerary.id}`, async (route: Route) => {
    if (route.request().method() === 'PUT') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            ...itinerary,
            updatedAt: new Date().toISOString(),
          },
        } as APIResponse<Itinerary>),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock delete itinerary
 */
export async function mockDeleteItinerary(
  page: Page,
  itineraryId: string
): Promise<void> {
  await page.route(`**/api/v1/itineraries/${itineraryId}`, async (route: Route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Itinerary deleted successfully',
        } as APIResponse),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Capture API request body
 */
export async function captureAPIRequestBody<T = any>(
  page: Page,
  urlPattern: string | RegExp
): Promise<T> {
  return new Promise((resolve) => {
    page.on('request', (request: Request) => {
      const url = request.url();
      const matches =
        typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url);

      if (matches && request.method() === 'POST') {
        const body = request.postDataJSON();
        resolve(body);
      }
    });
  });
}

/**
 * Wait for specific API call
 */
export async function waitForAPICall(
  page: Page,
  urlPattern: string | RegExp,
  method: string = 'GET'
): Promise<void> {
  await page.waitForResponse((response) => {
    const url = response.url();
    const matchesURL =
      typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url);
    const matchesMethod = response.request().method() === method;
    return matchesURL && matchesMethod;
  });
}

/**
 * Mock API with delay
 */
export async function mockAPIWithDelay(
  page: Page,
  urlPattern: string | RegExp,
  responseData: any,
  delayMs: number = 1000
): Promise<void> {
  await page.route(urlPattern, async (route: Route) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: responseData,
      } as APIResponse),
    });
  });
}

/**
 * Mock network error
 */
export async function mockNetworkError(
  page: Page,
  urlPattern: string | RegExp
): Promise<void> {
  await page.route(urlPattern, async (route: Route) => {
    await route.abort('failed');
  });
}

/**
 * Generate mock UUID
 */
export function generateMockId(): string {
  return 'mock-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
}

/**
 * Create mock itinerary object
 */
export function createMockItinerary(overrides?: Partial<Itinerary>): Itinerary {
  return {
    id: generateMockId(),
    title: 'Mock Itinerary',
    destination: 'Mock City',
    startDate: '2024-07-01',
    endDate: '2024-07-15',
    status: 'draft',
    currency: 'USD',
    userId: 'mock-user-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Intercept and log all API calls
 */
export async function logAPICallsinterceptor(page: Page): Promise<void> {
  page.on('request', (request: Request) => {
    if (request.url().includes('/api/')) {
      console.log(`>> ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', (response) => {
    if (response.url().includes('/api/')) {
      console.log(`<< ${response.status()} ${response.url()}`);
    }
  });
}
