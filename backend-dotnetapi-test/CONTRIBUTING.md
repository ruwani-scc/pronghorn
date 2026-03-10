# Contributing to Backend .NET API Tests

## Writing New Tests

### Test Structure

Follow this structure when writing new tests:

```typescript
import { test, expect } from '@playwright/test';
import { createTestItinerary } from '../utils/test-data';
import { validateItineraryResponse } from '../utils/validators';

test.describe('Feature Name', () => {
  // Setup before all tests
  test.beforeAll(async ({ request }) => {
    // Initialize test data
  });

  // Cleanup after all tests
  test.afterAll(async ({ request }) => {
    // Clean up test data
  });

  test.describe('Specific Functionality', () => {
    test('should do something specific', async ({ request }) => {
      // Arrange
      const testData = { /* ... */ };

      // Act
      const response = await request.post('/api/endpoint', {
        data: testData
      });

      // Assert
      expect(response.status()).toBe(201);
      const body = await response.json();
      validateItineraryResponse(body);
    });
  });
});
```

### Best Practices

#### 1. Use Helper Functions

Always use helper functions from `utils/` for common operations:

```typescript
// Good
import { createTestItinerary, cleanupTestData } from '../utils/test-data';
const itinerary = await createTestItinerary(request);

// Avoid
const response = await request.post('/api/itineraries', { data: {...} });
const itinerary = await response.json();
```

#### 2. Clean Up Test Data

Always clean up test data after tests:

```typescript
test.afterAll(async ({ request }) => {
  await cleanupTestData(request, testItineraryId);
});
```

#### 3. Use Validators

Validate response structures using validators:

```typescript
import { validateItineraryResponse, validateErrorResponse } from '../utils/validators';

const body = await response.json();
validateItineraryResponse(body);
```

#### 4. Test Names

Use descriptive test names that explain what is being tested:

```typescript
// Good
test('should return 404 when itinerary does not exist', async ({ request }) => {

// Avoid
test('test itinerary not found', async ({ request }) => {
```

#### 5. Group Related Tests

Use `test.describe()` to group related tests:

```typescript
test.describe('POST /api/itineraries - Create', () => {
  test('should create with valid data', ...);
  test('should fail with invalid data', ...);
});
```

### Test Categories

#### Happy Path Tests
Test successful operations with valid data:

```typescript
test('should create itinerary successfully', async ({ request }) => {
  const response = await request.post('/api/itineraries', {
    data: validItineraryData
  });
  expect(response.status()).toBe(201);
});
```

#### Error Handling Tests
Test error scenarios and validation:

```typescript
test('should fail with missing required fields', async ({ request }) => {
  const response = await request.post('/api/itineraries', {
    data: incompleteData
  });
  expect(response.status()).toBe(400);
  validateErrorResponse(await response.json());
});
```

#### Edge Case Tests
Test boundary conditions:

```typescript
test('should handle very long names', async ({ request }) => {
  const longName = 'a'.repeat(500);
  // Test with long name
});
```

#### Performance Tests
Test response times:

```typescript
test('should respond within 1 second', async ({ request }) => {
  const startTime = Date.now();
  await request.get('/api/itineraries');
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(1000);
});
```

### Adding New Utilities

#### API Helpers
Add new API helper functions to `utils/api-helpers.ts`:

```typescript
export async function newApiFunction(
  request: APIRequestContext,
  params: SomeType
): Promise<ResponseType> {
  const response = await request.post('/api/endpoint', { data: params });
  if (!response.ok()) {
    throw new Error(`Failed: ${response.status()}`);
  }
  return await response.json();
}
```

#### Validators
Add new validators to `utils/validators.ts`:

```typescript
export function validateNewResponse(response: any): void {
  expect(response).toBeDefined();
  expect(response).toHaveProperty('expectedField');
  // Add more validations
}
```

#### Test Data Generators
Add new test data generators to `utils/test-data.ts`:

```typescript
export async function createTestNewEntity(
  request: APIRequestContext,
  overrides?: Partial<NewEntityData>
): Promise<NewEntityData> {
  const defaultData = { /* ... */ };
  const data = { ...defaultData, ...overrides };
  return await createNewEntity(request, data);
}
```

### Running Tests Locally

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/health.spec.ts

# Run tests in UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run tests with headed browser
npm run test:headed
```

### Debugging Failed Tests

1. **Check test output**: Review the console output for error messages
2. **Use debug mode**: Run `npm run test:debug` to step through tests
3. **View trace**: Check `trace.playwright.dev` for detailed traces
4. **Check API logs**: Review .NET API logs for backend errors
5. **Verify test data**: Ensure test data is properly set up and cleaned up

### Code Style

- Use TypeScript for all test files
- Follow existing code formatting
- Use async/await instead of promises
- Add JSDoc comments for complex functions
- Keep test files focused on single features

### Pull Request Guidelines

1. Create a feature branch
2. Write tests for new functionality
3. Ensure all tests pass locally
4. Update README.md if needed
5. Submit PR with clear description
6. Wait for CI checks to pass

### Common Issues

#### Tests Failing Intermittently
- Check for race conditions
- Ensure proper cleanup between tests
- Add appropriate wait times

#### API Not Available
- Verify .NET API is running
- Check API_BASE_URL environment variable
- Verify database connection

#### Test Data Conflicts
- Use unique names with timestamps
- Clean up data in afterAll hooks
- Check for orphaned test data

### Getting Help

- Review existing tests for examples
- Check Playwright documentation: https://playwright.dev
- Ask team members for guidance
- Review test output and error messages carefully
