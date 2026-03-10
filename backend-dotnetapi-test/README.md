# Backend .NET API Tests

Playwright-based API tests for the VacationPlan .NET backend.

## Overview

This test suite provides comprehensive API testing for the VacationPlan .NET backend, including:
- Health check endpoints
- Itinerary CRUD operations
- Item CRUD operations
- Validation testing
- Error handling
- Performance testing

## Prerequisites

- Node.js 18+ installed
- .NET API running locally or accessible via network
- PostgreSQL database (for integration tests)

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the environment variables:
```
API_BASE_URL=http://localhost:5000
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test suites
```bash
npm run test:health        # Health check tests
npm run test:items         # Items API tests
npm run test:itineraries   # Itineraries API tests
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

## Test Structure

```
backend-dotnetapi-test/
├── tests/
│   ├── health.spec.ts          # Health check endpoint tests
│   ├── items.spec.ts           # Items API tests
│   ├── itineraries.spec.ts     # Itineraries API tests
│   └── integration.spec.ts     # Integration tests
├── utils/
│   ├── api-helpers.ts          # API helper functions
│   ├── test-data.ts            # Test data generators
│   └── validators.ts           # Response validators
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## Writing Tests

### Example API Test

```typescript
import { test, expect } from '@playwright/test';
import { createItinerary, getItinerary } from '../utils/api-helpers';

test('should create and retrieve itinerary', async ({ request }) => {
  const itinerary = await createItinerary(request, {
    name: 'Summer Vacation',
    destination: 'Hawaii',
    startDate: '2024-07-01',
    endDate: '2024-07-14'
  });

  expect(itinerary.id).toBeDefined();
  expect(itinerary.name).toBe('Summer Vacation');

  const retrieved = await getItinerary(request, itinerary.id);
  expect(retrieved).toEqual(itinerary);
});
```

## Test Coverage

### Health Endpoints
- Basic health check
- Detailed health with dependencies

### Items API
- Create item
- Get item by ID
- Update item
- Delete item
- List items by itinerary
- Validation errors

### Itineraries API
- Create itinerary
- Get itinerary by ID
- Update itinerary
- Delete itinerary
- List all itineraries
- Add items to itinerary
- Calculate completeness
- Validation errors

### Integration Tests
- Complete workflow (create, update, delete)
- Concurrent operations
- Data consistency

## CI/CD Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run API Tests
  run: |
    npm install
    npm test
  env:
    API_BASE_URL: ${{ secrets.API_BASE_URL }}
```

## Contributing

When adding new tests:
1. Follow existing patterns
2. Use helper functions from `utils/`
3. Clean up test data after each test
4. Add appropriate assertions
5. Update this README with new test cases
