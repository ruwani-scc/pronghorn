# E2E Test Automation Suite

## Feature: E-001-F-001 - Itinerary Creation

Comprehensive end-to-end test automation for the Itinerary Creation feature using Playwright with TypeScript, Page Object Model pattern, and data-driven testing approach.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Test Architecture](#test-architecture)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Page Object Models](#page-object-models)
- [Test Data](#test-data)
- [Test Coverage](#test-coverage)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🎯 Overview

### User Story
**As a traveler, I want to create a new trip itinerary**

### Acceptance Criteria
- ✅ Given trip details, when I submit, then itinerary is created
- ✅ Given no trip name, when I submit, then error is shown

### Test Framework Features
- ✨ **Playwright** - Fast, reliable cross-browser testing
- 📦 **TypeScript** - Type-safe test code
- 🏗️ **Page Object Model** - Maintainable, reusable page abstractions
- 📊 **Data-Driven Testing** - Multiple test scenarios with varied data
- 🎨 **Custom Assertions** - Domain-specific assertion library
- 🔧 **API Mocking** - Isolated testing with controlled responses
- 📸 **Auto Screenshots** - Visual debugging on failures
- 📹 **Video Recording** - Full test execution replay
- 📈 **HTML Reports** - Interactive test results

---

## 🏛️ Test Architecture

```
e2e-tests/
├── playwright.config.ts          # Playwright configuration
├── pages/                        # Page Object Models
│   ├── BasePage.ts              # Base class with common methods
│   ├── CreateItineraryPage.ts   # Create itinerary page
│   ├── DashboardPage.ts         # Dashboard page
│   └── ItineraryDetailPage.ts   # Itinerary detail page
├── test-data/                    # Test data and helpers
│   ├── itinerary-data.ts        # Test datasets
│   └── test-helpers.ts          # Utility functions
├── tests/                        # Test specifications
│   └── itinerary-creation.spec.ts
├── utils/                        # Utilities
│   ├── api-helpers.ts           # API mocking helpers
│   └── assertions.ts            # Custom assertions
├── screenshots/                  # Test screenshots (generated)
├── test-results/                # Test results (generated)
└── playwright-report/           # HTML reports (generated)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Frontend React application running on `http://localhost:5173`
- Backend API running on `http://localhost:5000` (or configured URL)

### Installation

1. **Navigate to the frontend-react directory:**
   ```bash
   cd frontend-react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

4. **Install system dependencies (Linux only):**
   ```bash
   npx playwright install-deps
   ```

### Configuration

Create a `.env` file in the `e2e-tests` directory (optional):

```env
BASE_URL=http://localhost:5173
API_URL=http://localhost:5000/api/v1
TIMEOUT=30000
```

---

## 🧪 Running Tests

### Run All Tests

```bash
# Run all tests in headless mode
npx playwright test

# Run with UI mode (recommended for development)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed
```

### Run Specific Tests

```bash
# Run specific test file
npx playwright test tests/itinerary-creation.spec.ts

# Run specific test by name
npx playwright test -g "Should successfully create itinerary"

# Run specific test suite
npx playwright test -g "Happy Path Scenarios"
```

### Run on Specific Browser

```bash
# Run on Chromium only
npx playwright test --project=chromium

# Run on Firefox
npx playwright test --project=firefox

# Run on WebKit (Safari)
npx playwright test --project=webkit

# Run on mobile browsers
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Debug Tests

```bash
# Debug mode with Playwright Inspector
npx playwright test --debug

# Debug specific test
npx playwright test -g "Should successfully create" --debug

# Show test trace on failure
npx playwright test --trace on
```

### Generate Reports

```bash
# Generate and open HTML report
npx playwright show-report

# Generate report without opening
npx playwright test --reporter=html
```

---

## 📁 Test Structure

### Test Organization

Tests are organized into logical suites:

```typescript
test.describe('E-001-F-001: Itinerary Creation', () => {
  test.describe('Happy Path Scenarios', () => {
    test('TC-001: Should successfully create itinerary', async () => {...});
  });
  
  test.describe('Validation Tests', () => {
    test('TC-007: Should show error when title missing', async () => {...});
  });
  
  test.describe('Edge Case Tests', () => {
    test('TC-014: Should handle very long title', async () => {...});
  });
});
```

### Test Naming Convention

- **TC-XXX**: Test Case ID for traceability
- **Descriptive Name**: Clear description of what is being tested
- **Should Pattern**: "Should [expected behavior] when [condition]"

---

## 📄 Page Object Models

### BasePage

Base class providing common functionality:

```typescript
class BasePage {
  async goto(path: string): Promise<void>
  async waitForPageLoad(): Promise<void>
  async clickElement(locator: Locator): Promise<void>
  async fillInput(locator: Locator, value: string): Promise<void>
  async isVisible(locator: Locator): Promise<boolean>
  // ... more utility methods
}
```

### CreateItineraryPage

Page Object for the Create Itinerary page:

```typescript
import { CreateItineraryPage } from '../pages/CreateItineraryPage';

const createPage = new CreateItineraryPage(page);
await createPage.navigateToPage();
await createPage.fillItineraryForm(testData);
await createPage.clickSubmit();
```

**Key Methods:**
- `navigateToPage()` - Navigate to create page
- `fillItineraryForm(data)` - Fill complete form
- `clickSubmit()` - Submit the form
- `verifyPageLoaded()` - Verify page elements
- `verifyRequiredFields()` - Check validation

### DashboardPage

Page Object for the Dashboard:

```typescript
const dashboardPage = new DashboardPage(page);
await dashboardPage.navigateToPage();
await dashboardPage.clickCreateItinerary();
await dashboardPage.verifyItineraryExists(title);
```

### ItineraryDetailPage

Page Object for the Itinerary Detail page:

```typescript
const detailPage = new ItineraryDetailPage(page);
await detailPage.navigateToPage(itineraryId);
await detailPage.verifyItineraryDetails({ title, destination });
```

---

## 📊 Test Data

### Data-Driven Testing

Test data is organized in `test-data/itinerary-data.ts`:

```typescript
import { validItineraryData, invalidItineraryData } from '../test-data/itinerary-data';

// Use pre-defined valid data
const testData = validItineraryData[0];

// Use invalid data for negative tests
const invalidData = invalidItineraryData.missingTitle;

// Generate random data
const randomData = generateRandomItinerary();
```

### Available Datasets

- **validItineraryData[]** - 5 complete valid itineraries
- **minimalValidData** - Minimal required fields only
- **invalidItineraryData** - Missing required fields scenarios
- **edgeCaseData** - Boundary conditions and edge cases
- **statusTestData[]** - Different status values
- **currencyTestData[]** - Different currency options

---

## ✅ Test Coverage

### Test Scenarios (27 Total)

#### Happy Path (3 tests)
- ✅ TC-001: Create itinerary with all fields
- ✅ TC-002: Create with minimal required fields
- ✅ TC-003: Loading state display

#### Data-Driven (5 tests)
- ✅ TC-004-1 to TC-004-5: Multiple valid datasets

#### Status Tests (4 tests)
- ✅ TC-005-1 to TC-005-4: Draft, Confirmed, Completed, Cancelled

#### Currency Tests (4 tests)
- ✅ TC-006-1 to TC-006-4: USD, EUR, GBP, JPY

#### Validation Tests (5 tests)
- ✅ TC-007: Missing title
- ✅ TC-008: Missing destination
- ✅ TC-009: Missing start date
- ✅ TC-010: Missing end date
- ✅ TC-011: Required fields marked

#### Date Validation (2 tests)
- ✅ TC-012: Same day trip
- ✅ TC-013: Past dates

#### Edge Cases (5 tests)
- ✅ TC-014: Very long title
- ✅ TC-015: Special characters
- ✅ TC-016: Unicode and emoji
- ✅ TC-017: Zero budget
- ✅ TC-018: Very high budget

#### Navigation (3 tests)
- ✅ TC-019: Cancel navigation
- ✅ TC-020: Navigate from dashboard
- ✅ TC-021: Form data preservation

#### Error Handling (3 tests)
- ✅ TC-022: API failure
- ✅ TC-023: Network timeout
- ✅ TC-024: Unauthorized (401)

#### Miscellaneous (3 tests)
- ✅ TC-025: Random data generation
- ✅ TC-026: Accessibility - labels
- ✅ TC-027: Keyboard navigation

---

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: |
          cd frontend-react
          npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: |
          cd frontend-react/e2e-tests
          npx playwright test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: frontend-react/e2e-tests/playwright-report/
```

### Running in Docker

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
```

---

## 🔧 Troubleshooting

### Common Issues

#### Tests Failing with "baseURL not configured"

**Solution:**
```bash
# Ensure frontend is running
npm run dev

# Or set BASE_URL environment variable
export BASE_URL=http://localhost:5173
```

#### Browser Not Installed

**Solution:**
```bash
npx playwright install chromium
# or all browsers
npx playwright install
```

#### Authentication Errors (401)

**Solution:**
Tests use mock authentication. Ensure `setupAuthentication(page)` is called in `beforeEach`.

#### Timeout Errors

**Solution:**
```typescript
// Increase timeout in playwright.config.ts
use: {
  actionTimeout: 15000, // 15 seconds
}

// Or in specific test
test('my test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
});
```

#### Element Not Found

**Solution:**
```typescript
// Add explicit waits
await page.waitForSelector('.my-element');

// Or use page.waitForLoadState
await page.waitForLoadState('networkidle');
```

### Debug Commands

```bash
# View last run trace
npx playwright show-trace trace.zip

# Open last HTML report
npx playwright show-report

# Run with verbose logging
DEBUG=pw:api npx playwright test
```

---

## 📚 Best Practices

### Test Writing

1. **Use Page Objects** - Always use POM pattern for maintainability
2. **Descriptive Names** - Clear, self-documenting test names
3. **Single Assertion Focus** - Each test should test one thing
4. **Independent Tests** - Tests should not depend on each other
5. **Clean Test Data** - Use fresh data for each test

### Selectors

```typescript
// ✅ Good - Use test IDs
page.locator('[data-testid="submit-button"]')

// ✅ Good - Use semantic selectors
page.locator('button:has-text("Submit")')

// ❌ Avoid - Fragile selectors
page.locator('.btn.btn-primary.mt-3')
```

### Waits and Timing

```typescript
// ✅ Good - Wait for specific condition
await page.waitForSelector('.success-message');

// ✅ Good - Wait for API response
await page.waitForResponse(resp => resp.url().includes('/api/'));

// ❌ Avoid - Arbitrary timeouts
await page.waitForTimeout(3000);
```

### Error Handling

```typescript
// ✅ Good - Graceful error handling
try {
  await createPage.clickSubmit();
  await page.waitForURL(/\/itineraries\//);
} catch (error) {
  await page.screenshot({ path: 'error.png' });
  throw error;
}
```

---

## 📖 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)

---

## 🤝 Contributing

When adding new tests:

1. Follow the existing Page Object Model structure
2. Add test data to `test-data/itinerary-data.ts`
3. Use descriptive test names with TC-XXX prefix
4. Update this README with new test scenarios
5. Ensure all tests pass before committing

---

## 📝 License

Part of the VacationPlan - Trip Itinerary Manager project.

---

**Last Updated:** 2024-01-09  
**Test Framework Version:** 1.0.0  
**Playwright Version:** 1.40.0
