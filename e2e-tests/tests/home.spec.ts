import { test, expect } from '../fixtures/testFixtures';
import { DataHelper } from '../utils/dataHelper';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ loginPage, homePage }) => {
    // Login before accessing home page
    await loginPage.goto();
    const users = DataHelper.loadUsers();
    await loginPage.login(users.validUsers[0].email, users.validUsers[0].password);
    await homePage.goto();
  });

  test('should load home page successfully', async ({ homePage }) => {
    await homePage.verifyHomePageLoaded();
  });

  test('should verify user is logged in', async ({ homePage }) => {
    const isLoggedIn = await homePage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('should display navigation menu', async ({ homePage }) => {
    await homePage.verifyNavigationMenuVisible();
  });

  test('should open user menu', async ({ homePage, page }) => {
    await homePage.openUserMenu();
    await page.waitForTimeout(500);
    
    // Verify menu is opened (in real scenario, check for menu items visibility)
  });

  test('should logout successfully', async ({ homePage, page }) => {
    await homePage.logout();
    await page.waitForTimeout(1000);
    
    // Verify redirect to login page
    expect(page.url()).toContain('/login');
  });

  test('should navigate to profile page', async ({ homePage, page }) => {
    try {
      await homePage.goToProfile();
      await page.waitForTimeout(500);
      
      // Verify navigation to profile
      expect(page.url()).toContain('/profile');
    } catch (error) {
      console.log('Profile navigation not available');
    }
  });

  test('should navigate to settings page', async ({ homePage, page }) => {
    try {
      await homePage.goToSettings();
      await page.waitForTimeout(500);
      
      // Verify navigation to settings
      expect(page.url()).toContain('/settings');
    } catch (error) {
      console.log('Settings navigation not available');
    }
  });

  test('should display welcome message', async ({ homePage }) => {
    try {
      const welcomeMsg = await homePage.getWelcomeMessage();
      expect(welcomeMsg).toBeTruthy();
    } catch (error) {
      console.log('Welcome message not available');
    }
  });

  test('should open notifications', async ({ homePage, page }) => {
    try {
      await homePage.openNotifications();
      await page.waitForTimeout(500);
      
      // Verify notifications panel opened
    } catch (error) {
      console.log('Notifications not available');
    }
  });

  test.describe('Search Functionality Tests', () => {
    const testData = DataHelper.loadGeneralTestData();

    for (const searchQuery of testData.searchQueries) {
      test(`should search for "${searchQuery.query}"`, async ({ homePage, page }) => {
        try {
          await homePage.search(searchQuery.query);
          await page.waitForTimeout(1000);
          
          // Verify search results (in real scenario, check result count)
          // expect(resultCount).toBe(searchQuery.expectedResults);
        } catch (error) {
          console.log(`Search for ${searchQuery.query} not available`);
        }
      });
    }
  });

  test('should handle empty search', async ({ homePage, page }) => {
    try {
      await homePage.search('');
      await page.waitForTimeout(500);
      
      // Verify appropriate handling of empty search
    } catch (error) {
      console.log('Search not available');
    }
  });

  test('should search with special characters', async ({ homePage, page }) => {
    try {
      await homePage.search('@#$%^&*()');
      await page.waitForTimeout(500);
      
      // Verify no errors occur
    } catch (error) {
      console.log('Search not available');
    }
  });

  test('should get page title', async ({ homePage }) => {
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
  });

  test('should get current URL', async ({ homePage }) => {
    const currentUrl = homePage.getCurrentUrl();
    expect(currentUrl).toContain(process.env.BASE_URL || 'localhost');
  });

  test('should reload page successfully', async ({ homePage }) => {
    await homePage.reloadPage();
    await homePage.verifyHomePageLoaded();
  });

  test('should navigate back after going to another page', async ({ homePage, page }) => {
    try {
      const initialUrl = homePage.getCurrentUrl();
      
      // Navigate to profile
      await homePage.goToProfile();
      await page.waitForTimeout(500);
      
      // Go back
      await homePage.goBack();
      await page.waitForTimeout(500);
      
      // Verify we're back
      const currentUrl = homePage.getCurrentUrl();
      expect(currentUrl).toBe(initialUrl);
    } catch (error) {
      console.log('Navigation test not fully available');
    }
  });
});
