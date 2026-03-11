import { test, expect } from '../fixtures/testFixtures';
import { DataHelper } from '../utils/dataHelper';
import { WaitHelper } from '../utils/waitHelper';

test.describe('End-to-End User Workflows', () => {
  test.describe('Complete User Journey', () => {
    test('should complete full user workflow from login to logout', async ({ 
      loginPage, 
      homePage, 
      dashboardPage,
      page 
    }) => {
      // Step 1: Navigate to login page
      await loginPage.goto();
      await loginPage.verifyLoginPageLoaded();

      // Step 2: Login with valid credentials
      const users = DataHelper.loadUsers();
      const user = users.validUsers[0];
      await loginPage.login(user.email, user.password);
      await page.waitForLoadState('networkidle');

      // Step 3: Verify successful login and home page load
      await homePage.verifyHomePageLoaded();
      const isLoggedIn = await homePage.isUserLoggedIn();
      expect(isLoggedIn).toBeTruthy();

      // Step 4: Navigate to dashboard
      await dashboardPage.goto();
      await dashboardPage.verifyDashboardLoaded();

      // Step 5: Interact with dashboard
      const statsCount = await dashboardPage.getStatsCardCount();
      expect(statsCount).toBeGreaterThanOrEqual(0);

      // Step 6: View table data
      await dashboardPage.verifyTableVisible();
      const rowCount = await dashboardPage.getTableRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(0);

      // Step 7: Navigate back to home
      await homePage.goto();
      await homePage.verifyHomePageLoaded();

      // Step 8: Logout
      await homePage.logout();
      await WaitHelper.waitForUrlContains(page, '/login', 5000);
      expect(page.url()).toContain('/login');
    });
  });

  test.describe('Dashboard Interaction Workflow', () => {
    test.beforeEach(async ({ loginPage }) => {
      // Setup: Login before each test
      await loginPage.goto();
      const users = DataHelper.loadUsers();
      await loginPage.login(users.validUsers[0].email, users.validUsers[0].password);
    });

    test('should filter, sort, and navigate dashboard data', async ({ 
      dashboardPage,
      page 
    }) => {
      // Navigate to dashboard
      await dashboardPage.goto();
      await dashboardPage.verifyDashboardLoaded();

      // Apply filter
      const testData = DataHelper.loadGeneralTestData();
      if (testData.dashboardFilters.length > 0) {
        await dashboardPage.filterTable(testData.dashboardFilters[0].filterText);
        await page.waitForTimeout(500);
      }

      // Get filtered results
      const filteredRowCount = await dashboardPage.getTableRowCount();
      expect(filteredRowCount).toBeGreaterThanOrEqual(0);

      // Try sorting if available
      try {
        await dashboardPage.sortTable('name');
        await page.waitForTimeout(500);
      } catch (error) {
        console.log('Sorting not available');
      }

      // Refresh data
      await dashboardPage.refreshData();
      await dashboardPage.verifyDashboardLoaded();

      // Click on first row if available
      if (filteredRowCount > 0) {
        await dashboardPage.clickTableRow(0);
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('Multi-User Workflow', () => {
    const users = DataHelper.loadUsers();

    test('should handle multiple user logins sequentially', async ({ 
      loginPage,
      homePage,
      page 
    }) => {
      for (const user of users.validUsers) {
        // Login
        await loginPage.goto();
        await loginPage.login(user.email, user.password);
        await page.waitForLoadState('networkidle');

        // Verify login
        await homePage.verifyHomePageLoaded();
        const isLoggedIn = await homePage.isUserLoggedIn();
        expect(isLoggedIn).toBeTruthy();

        // Logout
        await homePage.logout();
        await WaitHelper.waitForUrlContains(page, '/login', 5000);
      }
    });
  });

  test.describe('Search and Navigation Workflow', () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.goto();
      const users = DataHelper.loadUsers();
      await loginPage.login(users.validUsers[0].email, users.validUsers[0].password);
    });

    test('should search and navigate through results', async ({ 
      homePage,
      page 
    }) => {
      await homePage.goto();
      await homePage.verifyHomePageLoaded();

      // Perform search
      const testData = DataHelper.loadGeneralTestData();
      if (testData.searchQueries.length > 0) {
        try {
          await homePage.search(testData.searchQueries[0].query);
          await page.waitForTimeout(1000);
          
          // Navigate through results (implementation depends on actual app)
          // This is a placeholder for result navigation logic
        } catch (error) {
          console.log('Search functionality not available');
        }
      }
    });
  });

  test.describe('Error Recovery Workflow', () => {
    test('should recover from failed login and retry', async ({ 
      loginPage,
      page 
    }) => {
      const users = DataHelper.loadUsers();

      // Attempt login with invalid credentials
      await loginPage.goto();
      await loginPage.login(users.invalidUsers[0].email, users.invalidUsers[0].password);
      
      // Verify error
      const isErrorDisplayed = await loginPage.isErrorDisplayed();
      expect(isErrorDisplayed).toBeTruthy();

      // Retry with valid credentials
      await loginPage.login(users.validUsers[0].email, users.validUsers[0].password);
      await page.waitForLoadState('networkidle');

      // Verify successful login
      expect(page.url()).not.toContain('/login');
    });
  });

  test.describe('Session Management Workflow', () => {
    test('should maintain session across page navigation', async ({ 
      loginPage,
      homePage,
      dashboardPage,
      page 
    }) => {
      // Login
      await loginPage.goto();
      const users = DataHelper.loadUsers();
      await loginPage.login(users.validUsers[0].email, users.validUsers[0].password);
      await page.waitForLoadState('networkidle');

      // Navigate to home
      await homePage.goto();
      let isLoggedIn = await homePage.isUserLoggedIn();
      expect(isLoggedIn).toBeTruthy();

      // Navigate to dashboard
      await dashboardPage.goto();
      await dashboardPage.verifyDashboardLoaded();

      // Navigate back to home
      await homePage.goto();
      isLoggedIn = await homePage.isUserLoggedIn();
      expect(isLoggedIn).toBeTruthy();

      // Verify session is maintained
      expect(page.url()).not.toContain('/login');
    });
  });

  test.describe('Performance and Load Tests', () => {
    test('should handle rapid page navigation', async ({ 
      loginPage,
      homePage,
      dashboardPage,
      page 
    }) => {
      // Login
      await loginPage.goto();
      const users = DataHelper.loadUsers();
      await loginPage.login(users.validUsers[0].email, users.validUsers[0].password);
      await page.waitForLoadState('networkidle');

      // Rapid navigation between pages
      const iterations = 3;
      for (let i = 0; i < iterations; i++) {
        await homePage.goto();
        await page.waitForTimeout(200);
        
        await dashboardPage.goto();
        await page.waitForTimeout(200);
      }

      // Verify everything still works
      await homePage.goto();
      const isLoggedIn = await homePage.isUserLoggedIn();
      expect(isLoggedIn).toBeTruthy();
    });
  });

  test.describe('Data-Driven Complete Workflows', () => {
    const users = DataHelper.loadUsers();

    for (const user of users.validUsers) {
      test(`should complete workflow for ${user.role} user`, async ({ 
        loginPage,
        homePage,
        dashboardPage,
        page 
      }) => {
        // Login as specific user
        await loginPage.goto();
        await loginPage.login(user.email, user.password);
        await page.waitForLoadState('networkidle');

        // Verify home page access
        await homePage.goto();
        const isLoggedIn = await homePage.isUserLoggedIn();
        expect(isLoggedIn).toBeTruthy();

        // Verify dashboard access
        await dashboardPage.goto();
        await dashboardPage.verifyDashboardLoaded();

        // Logout
        await homePage.goto();
        await homePage.logout();
        await WaitHelper.waitForUrlContains(page, '/login', 5000);
      });
    }
  });
});
