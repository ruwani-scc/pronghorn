/**
 * Test Data for Itinerary Creation E2E Tests
 * Data-driven testing approach with various scenarios
 */

export interface CreateItineraryData {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  status?: string;
  currency?: string;
  budget?: number;
}

/**
 * Valid test data sets for successful itinerary creation
 */
export const validItineraryData: CreateItineraryData[] = [
  {
    title: 'Summer Trip to Europe',
    destination: 'Paris, France',
    startDate: '2024-07-01',
    endDate: '2024-07-15',
    description: 'Two weeks exploring the beautiful cities of Europe',
    status: 'draft',
    currency: 'EUR',
    budget: 5000,
  },
  {
    title: 'Weekend in Tokyo',
    destination: 'Tokyo, Japan',
    startDate: '2024-09-10',
    endDate: '2024-09-13',
    description: 'Quick getaway to experience Japanese culture',
    status: 'confirmed',
    currency: 'JPY',
    budget: 2000,
  },
  {
    title: 'Beach Vacation in Bali',
    destination: 'Bali, Indonesia',
    startDate: '2024-12-01',
    endDate: '2024-12-10',
    description: 'Relaxing beach vacation with surfing and spa',
    status: 'draft',
    currency: 'USD',
    budget: 3500,
  },
  {
    title: 'Road Trip Across USA',
    destination: 'Multiple Cities, USA',
    startDate: '2024-08-01',
    endDate: '2024-08-31',
    description: 'Cross-country road trip from New York to Los Angeles',
    status: 'draft',
    currency: 'USD',
    budget: 8000,
  },
  {
    title: 'Ski Trip to Switzerland',
    destination: 'Zermatt, Switzerland',
    startDate: '2025-01-15',
    endDate: '2025-01-22',
    description: 'Winter skiing in the Swiss Alps',
    status: 'confirmed',
    currency: 'CHF',
    budget: 6000,
  },
];

/**
 * Minimal valid data (only required fields)
 */
export const minimalValidData: CreateItineraryData = {
  title: 'Quick Trip',
  destination: 'London, UK',
  startDate: '2024-06-01',
  endDate: '2024-06-03',
};

/**
 * Invalid test data sets for validation testing
 */
export const invalidItineraryData = {
  missingTitle: {
    title: '',
    destination: 'Paris, France',
    startDate: '2024-07-01',
    endDate: '2024-07-15',
  },
  missingDestination: {
    title: 'Summer Trip',
    destination: '',
    startDate: '2024-07-01',
    endDate: '2024-07-15',
  },
  missingStartDate: {
    title: 'Summer Trip',
    destination: 'Paris, France',
    startDate: '',
    endDate: '2024-07-15',
  },
  missingEndDate: {
    title: 'Summer Trip',
    destination: 'Paris, France',
    startDate: '2024-07-01',
    endDate: '',
  },
  endBeforeStart: {
    title: 'Invalid Dates Trip',
    destination: 'Rome, Italy',
    startDate: '2024-07-15',
    endDate: '2024-07-01',
  },
  sameDayTrip: {
    title: 'Same Day Trip',
    destination: 'New York, USA',
    startDate: '2024-07-01',
    endDate: '2024-07-01',
  },
};

/**
 * Edge case test data
 */
export const edgeCaseData = {
  veryLongTitle: {
    title: 'A'.repeat(300), // Test max length handling
    destination: 'Test City',
    startDate: '2024-07-01',
    endDate: '2024-07-02',
  },
  veryLongDescription: {
    title: 'Test Trip',
    destination: 'Test City',
    startDate: '2024-07-01',
    endDate: '2024-07-02',
    description: 'B'.repeat(2000),
  },
  specialCharactersInTitle: {
    title: 'Trip with Special Chars: @#$%^&*()[]{}',
    destination: 'Test City',
    startDate: '2024-07-01',
    endDate: '2024-07-02',
  },
  unicodeCharacters: {
    title: '东京旅行 🗼 Tokyo Trip',
    destination: '東京、日本 Tokyo, Japan',
    startDate: '2024-07-01',
    endDate: '2024-07-02',
    description: 'Trip with emoji 🌸🗻🍣 and unicode characters',
  },
  veryHighBudget: {
    title: 'Luxury World Tour',
    destination: 'Multiple Countries',
    startDate: '2024-07-01',
    endDate: '2024-12-31',
    budget: 999999999,
    currency: 'USD',
  },
  zeroBudget: {
    title: 'Budget Backpacking',
    destination: 'Southeast Asia',
    startDate: '2024-07-01',
    endDate: '2024-07-15',
    budget: 0,
    currency: 'USD',
  },
};

/**
 * Test data for different statuses
 */
export const statusTestData: CreateItineraryData[] = [
  {
    title: 'Draft Trip',
    destination: 'Barcelona, Spain',
    startDate: '2024-08-01',
    endDate: '2024-08-07',
    status: 'draft',
  },
  {
    title: 'Confirmed Trip',
    destination: 'Amsterdam, Netherlands',
    startDate: '2024-09-01',
    endDate: '2024-09-05',
    status: 'confirmed',
  },
  {
    title: 'Completed Trip',
    destination: 'Prague, Czech Republic',
    startDate: '2024-05-01',
    endDate: '2024-05-05',
    status: 'completed',
  },
  {
    title: 'Cancelled Trip',
    destination: 'Budapest, Hungary',
    startDate: '2024-10-01',
    endDate: '2024-10-05',
    status: 'cancelled',
  },
];

/**
 * Test data for different currencies
 */
export const currencyTestData: CreateItineraryData[] = [
  {
    title: 'USD Trip',
    destination: 'New York, USA',
    startDate: '2024-07-01',
    endDate: '2024-07-05',
    currency: 'USD',
    budget: 3000,
  },
  {
    title: 'EUR Trip',
    destination: 'Berlin, Germany',
    startDate: '2024-08-01',
    endDate: '2024-08-05',
    currency: 'EUR',
    budget: 2500,
  },
  {
    title: 'GBP Trip',
    destination: 'London, UK',
    startDate: '2024-09-01',
    endDate: '2024-09-05',
    currency: 'GBP',
    budget: 2000,
  },
  {
    title: 'JPY Trip',
    destination: 'Osaka, Japan',
    startDate: '2024-10-01',
    endDate: '2024-10-05',
    currency: 'JPY',
    budget: 300000,
  },
];

/**
 * Helper function to get future date
 */
export function getFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

/**
 * Helper function to generate random itinerary data
 */
export function generateRandomItinerary(): CreateItineraryData {
  const destinations = [
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA',
    'London, UK',
    'Sydney, Australia',
    'Barcelona, Spain',
    'Dubai, UAE',
    'Singapore',
  ];
  
  const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
  const randomBudget = Math.floor(Math.random() * 10000) + 1000;
  
  return {
    title: `Trip to ${randomDestination.split(',')[0]} ${Date.now()}`,
    destination: randomDestination,
    startDate: getFutureDate(30),
    endDate: getFutureDate(37),
    description: `Randomly generated test itinerary for ${randomDestination}`,
    budget: randomBudget,
    currency: 'USD',
    status: 'draft',
  };
}
