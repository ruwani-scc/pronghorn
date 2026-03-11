import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { DashboardPage } from '../pages/DashboardPage';

/**
 * Custom fixtures for page objects and test setup
 */
type TestFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  dashboardPage: DashboardPage;
  authenticatedPage: void;
};

/**
 * Extend base test with custom fixtures
 */
export const test = base.extend<TestFixtures>({
  /**
   * Login page fixture
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Home page fixture
   */
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  /**
   * Dashboard page fixture
   */
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  /**
   * Authenticated page fixture - automatically logs in before test
   */
  authenticatedPage: async ({ page }, use) => {
    // Perform login before test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_USER_EMAIL || 'admin@example.com',
      process.env.TEST_USER_PASSWORD || 'Admin@123'
    );
    
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    
    await use();
    
    // Cleanup: logout after test
    const homePage = new HomePage(page);
    try {
      await homePage.logout();
    } catch {
      // Ignore logout errors
    }
  },
});

export { expect } from '@playwright/test';
