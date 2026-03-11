# Contributing to E2E Tests

Thank you for contributing to the E2E test suite! This guide will help you write effective and maintainable tests.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Writing Tests](#writing-tests)
- [Page Object Model Guidelines](#page-object-model-guidelines)
- [Test Data Guidelines](#test-data-guidelines)
- [Best Practices](#best-practices)
- [Code Review Checklist](#code-review-checklist)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Setup Development Environment

1. **Clone and install:**
   ```bash
   cd frontend-react
   npm install
   cd e2e-tests
   npm run test:e2e:install
   ```

2. **Run tests to verify setup:**
   ```bash
   npm run test:e2e
   ```

3. **Open Playwright UI for development:**
   ```bash
   npm run test:e2e:ui
   ```

---

## ✍️ Writing Tests

### Test Structure Template

```typescript
import { test, expect } from '@playwright/test';
import { YourPage } from '../pages/YourPage';
import { setupAuthentication } from '../test-data/test-helpers';

test.describe('Feature: Your Feature Name', () => {
  let yourPage: YourPage;

  test.beforeEach(async ({ page }) => {
    await setupAuthentication(page);
    yourPage = new YourPage(page);
    await yourPage.navigateToPage();
  });

  test.describe('Test Suite Name', () => {
    test('TC-XXX: Should do something when condition', async ({ page }) => {
      // Arrange - Setup test data and preconditions
      const testData = { /* ... */ };
      
      // Act - Perform the action
      await yourPage.performAction(testData);
      
      // Assert - Verify expected outcome
      await expect(page).toHaveURL(/expected-url/);
      await yourPage.verifyResult();
    });
  });
});
```

### Test Naming Convention

- **Format:** `TC-XXX: Should [action] when [condition]`
- **Examples:**
  - ✅ `TC-001: Should create itinerary when all fields are valid`
  - ✅ `TC-002: Should show error when title is missing`
  - ❌ `test1` (too vague)
  - ❌ `createItinerary` (not descriptive)

### Test Organization

```typescript
test.describe('Feature Name', () => {
  test.describe('Happy Path', () => { /* ... */ });
  test.describe('Validation Tests', () => { /* ... */ });
  test.describe('Edge Cases', () => { /* ... */ });
  test.describe('Error Handling', () => { /* ... */ });
});
```

---

## 🏗️ Page Object Model Guidelines

### Creating a New Page Object

1. **Extend BasePage:**
   ```typescript
   import { Page, Locator } from '@playwright/test';
   import { BasePage } from './BasePage';

   export class YourPage extends BasePage {
     // Declare locators
     readonly element: Locator;

     constructor(page: Page) {
       super(page);
       this.element = page.locator('#your-element');
     }

     // Page-specific methods
     async performAction(): Promise<void> {
       await this.clickElement(this.element);
     }
   }
   ```

### Locator Best Practices

```typescript
// ✅ Good - Use data-testid
this.submitButton = page.locator('[data-testid="submit-btn"]');

// ✅ Good - Use role and accessible name
this.submitButton = page.getByRole('button', { name: 'Submit' });

// ✅ Good - Use semantic selectors
this.title = page.locator('h1');

// ⚠️ Caution - CSS classes (can be fragile)
this.button = page.locator('.btn-primary');

// ❌ Avoid - Complex CSS selectors
this.button = page.locator('div > div.container > button.btn.btn-lg');
```

### Method Guidelines

```typescript
// ✅ Good - Single responsibility
async fillTitle(title: string): Promise<void> {
  await this.fillInput(this.titleInput, title);
}

// ✅ Good - Descriptive name
async submitItineraryForm(): Promise<void> {
  await this.clickSubmit();
  await this.waitForNavigation();
}

// ❌ Avoid - Doing too much
async fillFormAndSubmit(): Promise<void> {
  // Too many responsibilities
}
```

---

## 📊 Test Data Guidelines

### Adding Test Data

1. **Add to `test-data/itinerary-data.ts`:**
   ```typescript
   export const yourTestData = {
     field1: 'value1',
     field2: 'value2',
   };
   ```

2. **Use in tests:**
   ```typescript
   import { yourTestData } from '../test-data/itinerary-data';
   
   test('should work', async () => {
     await page.fillForm(yourTestData);
   });
   ```

### Data-Driven Tests

```typescript
const testCases = [
  { input: 'data1', expected: 'result1' },
  { input: 'data2', expected: 'result2' },
];

testCases.forEach((testCase, index) => {
  test(`TC-XXX-${index}: Should handle ${testCase.input}`, async () => {
    // Test logic
  });
});
```

---

## 🎯 Best Practices

### 1. Test Isolation

```typescript
// ✅ Good - Each test is independent
test.beforeEach(async ({ page }) => {
  await setupFreshState(page);
});

test('test 1', async () => { /* ... */ });
test('test 2', async () => { /* ... */ });

// ❌ Avoid - Tests depend on each other
test('test 1', async () => { /* creates data */ });
test('test 2', async () => { /* uses data from test 1 */ });
```

### 2. Explicit Waits

```typescript
// ✅ Good - Wait for specific condition
await page.waitForSelector('.success-message');
await page.waitForLoadState('networkidle');

// ❌ Avoid - Arbitrary timeouts
await page.waitForTimeout(3000);
```

### 3. Error Messages

```typescript
// ✅ Good - Descriptive error messages
await expect(page, 'User should be redirected to dashboard').toHaveURL('/dashboard');

// ❌ Avoid - No context
await expect(page).toHaveURL('/dashboard');
```

### 4. Screenshots and Traces

```typescript
test('critical flow', async ({ page }) => {
  try {
    await criticalAction();
  } catch (error) {
    await page.screenshot({ path: 'error-state.png', fullPage: true });
    throw error;
  }
});
```

### 5. Clean Code

```typescript
// ✅ Good - Extract reusable logic
async function createTestItinerary(page: Page, data: ItineraryData) {
  const createPage = new CreateItineraryPage(page);
  await createPage.fillItineraryForm(data);
  await createPage.clickSubmit();
  return extractItineraryIdFromURL(page.url());
}

// ❌ Avoid - Repeating code in every test
test('test 1', async ({ page }) => {
  await page.goto('/create');
  await page.fill('#title', 'Trip');
  await page.fill('#destination', 'Paris');
  // ... repeated in every test
});
```

---

## ✅ Code Review Checklist

Before submitting a PR, ensure:

- [ ] Tests follow naming convention (TC-XXX format)
- [ ] Tests use Page Object Model pattern
- [ ] No hardcoded waits (`waitForTimeout`)
- [ ] Tests are independent and can run in any order
- [ ] Test data is in `test-data/` folder
- [ ] Selectors use best practices (data-testid, roles)
- [ ] Error messages are descriptive
- [ ] Tests pass locally on all browsers
- [ ] No console errors or warnings
- [ ] README updated if new features added
- [ ] Comments explain complex logic

---

## 🐛 Troubleshooting

### Debug Mode

```bash
# Run specific test in debug mode
npx playwright test -g "TC-001" --debug
```

### Trace Viewer

```bash
# Generate trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Headed Mode

```bash
# See browser during test
npx playwright test --headed --project=chromium
```

### Verbose Logging

```bash
# Enable debug logs
DEBUG=pw:api npx playwright test
```

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

## 🤝 Questions?

If you have questions or need help:

1. Check the [README.md](./README.md)
2. Review existing tests for examples
3. Ask in team chat or create an issue

---

**Happy Testing! 🎉**
