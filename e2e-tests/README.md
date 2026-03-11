# E2E Test Suite

Comprehensive end-to-end testing framework using Playwright with TypeScript, Page Object Model (POM), and Data-Driven Testing (DDT).

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Page Object Model](#page-object-model)
- [Data-Driven Testing](#data-driven-testing)
- [Test Fixtures](#test-fixtures)
- [Utilities](#utilities)
- [Reporting](#reporting)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## 🎯 Overview

This test suite provides automated end-to-end testing for the application using:

- **Playwright**: Modern, reliable browser automation
- **TypeScript**: Type-safe test development
- **Page Object Model**: Maintainable and reusable page abstractions
- **Data-Driven Testing**: Parameterized tests using JSON data files
- **Cross-Browser Testing**: Chromium, Firefox, WebKit, and mobile browsers
- **Parallel Execution**: Fast test execution
- **Rich Reporting**: HTML, JSON, and JUnit reports

## ✅ Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: Latest version

## 📦 Installation

1. Navigate to the e2e-tests directory:
   ```bash
   cd e2e-tests
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

## 📁 Project Structure

```
e2e-tests/
├── tests/                      # Test specifications
│   ├── login.spec.ts          # Login functionality tests
│   ├── dashboard.spec.ts      # Dashboard tests
│   ├── home.spec.ts           # Home page tests
│   └── e2e-workflow.spec.ts   # End-to-end workflow tests
├── pages/                      # Page Object Model
│   ├── BasePage.ts            # Base page with common methods
│   ├── LoginPage.ts           # Login page object
│   ├── HomePage.ts            # Home page object
│   └── DashboardPage.ts       # Dashboard page object
├── data/                       # Test data files
│   ├── users.json             # User test data
│   └── testData.json          # General test data
├── fixtures/                   # Test fixtures
│   └── testFixtures.ts        # Custom test fixtures
├── utils/                      # Utility helpers
│   ├── dataHelper.ts          # Data manipulation utilities
│   ├── waitHelper.ts          # Wait and synchronization helpers
│   └── reportHelper.ts        # Reporting utilities
├── test-results/               # Test execution results (auto-generated)
├── playwright-report/          # HTML reports (auto-generated)
├── playwright.config.ts        # Playwright configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
BASE_URL=http://localhost:3000
API_URL=http://localhost:5000
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
```

### Playwright Configuration

The `playwright.config.ts` file contains:

- **Test directory**: `./tests`
- **Parallel execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Reporters**: HTML, JSON, JUnit
- **Timeout**: 10 seconds per action
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### Headed Mode (with browser UI)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### UI Mode (interactive)
```bash
npm run test:ui
```

### Specific Browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Mobile Browsers
```bash
npm run test:mobile
```

### Specific Test File
```bash
npx playwright test tests/login.spec.ts
```

### Specific Test Case
```bash
npx playwright test -g "should login successfully"
```

### View Reports
```bash
npm run report
```

### Code Generation
```bash
npm run codegen
```

## ✍️ Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.login('user@example.com', 'password123');
    
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### Data-Driven Tests

```typescript
import { test, expect } from '@playwright/test';
import { loadTestData } from '../utils/dataHelper';

const users = loadTestData('users.json');

for (const user of users) {
  test(`Login test for ${user.email}`, async ({ page }) => {
    // Test implementation
  });
}
```

## 📄 Page Object Model

### Base Page

All page objects extend `BasePage` which provides common methods:

- `navigate(url)`: Navigate to a URL
- `click(selector)`: Click an element
- `fill(selector, text)`: Fill input field
- `getText(selector)`: Get element text
- `waitForElement(selector)`: Wait for element
- `isVisible(selector)`: Check visibility

### Creating a New Page Object

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  private readonly selectors = {
    button: '#submit-button',
    input: '#text-input',
  };

  async clickButton(): Promise<void> {
    await this.click(this.selectors.button);
  }

  async fillInput(text: string): Promise<void> {
    await this.fill(this.selectors.input, text);
  }
}
```

## 📊 Data-Driven Testing

### Test Data Files

Test data is stored in JSON files under the `data/` directory:

**users.json**:
```json
[
  {
    "email": "user1@example.com",
    "password": "password123",
    "role": "admin"
  },
  {
    "email": "user2@example.com",
    "password": "password456",
    "role": "user"
  }
]
```

### Loading Test Data

```typescript
import { loadTestData } from '../utils/dataHelper';

const users = loadTestData('users.json');
const testData = loadTestData('testData.json');
```

## 🔧 Test Fixtures

Custom fixtures provide reusable setup and teardown logic:

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});
```

## 🛠️ Utilities

### Data Helper

- `loadTestData(filename)`: Load JSON test data
- `getRandomUser()`: Get random user from users.json
- `generateTestData()`: Generate dynamic test data

### Wait Helper

- `waitForNavigation(page)`: Wait for navigation to complete
- `waitForTimeout(ms)`: Wait for specified milliseconds
- `waitForCondition(condition)`: Wait for custom condition

### Report Helper

- `takeScreenshot(page, name)`: Capture screenshot
- `attachFile(test, path)`: Attach file to test report
- `logTestStep(message)`: Log test step

## 📈 Reporting

### HTML Report

Automatically generated after test execution:
```bash
npm run report
```

### JSON Report

Located at `test-results/results.json`

### JUnit Report

Located at `test-results/results.xml` (for CI integration)

### Screenshots and Videos

- Screenshots: Captured on failure
- Videos: Retained on failure
- Traces: Available on first retry

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd e2e-tests
          npm ci
      - name: Install Playwright browsers
        run: |
          cd e2e-tests
          npx playwright install --with-deps
      - name: Run tests
        run: |
          cd e2e-tests
          npm test
        env:
          CI: true
          BASE_URL: ${{ secrets.BASE_URL }}
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: e2e-tests/playwright-report/
```

## 💡 Best Practices

### 1. Use Page Object Model
- Keep selectors in page objects
- Create reusable methods for common actions
- Avoid direct selector usage in tests

### 2. Data-Driven Testing
- Store test data in JSON files
- Use parameterized tests for similar scenarios
- Keep test data separate from test logic

### 3. Test Independence
- Each test should be independent
- Use fixtures for setup/teardown
- Avoid test dependencies

### 4. Assertions
- Use explicit waits and assertions
- Prefer `expect` assertions over boolean checks
- Use appropriate timeout values

### 5. Naming Conventions
- Descriptive test names: `test('should display error message for invalid credentials')`
- Clear variable names
- Consistent file naming

### 6. Error Handling
- Use try-catch for expected failures
- Add meaningful error messages
- Capture screenshots on failures

### 7. Test Organization
- Group related tests using `test.describe`
- Use `test.beforeEach` and `test.afterEach` for common setup
- Keep tests focused and concise

### 8. Performance
- Run tests in parallel when possible
- Use headless mode for faster execution
- Optimize wait times

### 9. Maintenance
- Regularly update dependencies
- Review and refactor test code
- Remove obsolete tests
- Keep documentation updated

### 10. Debugging
- Use `--debug` flag for step-by-step debugging
- Use `--ui` mode for interactive debugging
- Add `await page.pause()` for breakpoints
- Check Playwright trace viewer for failed tests

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🤝 Contributing

When adding new tests:

1. Follow the existing project structure
2. Create page objects for new pages
3. Add test data to appropriate JSON files
4. Write clear, descriptive test cases
5. Update this README if adding new features
6. Run all tests before submitting changes

## 📝 License

ISC

## 👥 Support

For issues or questions, please contact the development team or create an issue in the repository.
