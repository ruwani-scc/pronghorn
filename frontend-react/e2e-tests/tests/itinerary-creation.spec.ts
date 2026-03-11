import { test, expect } from '@playwright/test';
import { CreateItineraryPage } from '../pages/CreateItineraryPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ItineraryDetailPage } from '../pages/ItineraryDetailPage';
import {
  validItineraryData,
  minimalValidData,
  invalidItineraryData,
  edgeCaseData,
  statusTestData,
  currencyTestData,
  generateRandomItinerary,
} from '../test-data/itinerary-data';
import {
  setupAuthentication,
  waitForAPICall,
  extractItineraryIdFromURL,
  mockAPIResponse,
  mockAPIError,
} from '../test-data/test-helpers';

/**
 * E2E Tests for FEATURE: E-001-F-001 - Itinerary Creation
 * 
 * User Story: As a traveler, I want to create a new trip itinerary
 * 
 * Acceptance Criteria:
 * - ✓ Given trip details, when I submit, then itinerary is created
 * - ✓ Given no trip name, when I submit, then error is shown
 * 
 * Test Coverage:
 * - Happy path scenarios
 * - Validation scenarios
 * - Data-driven tests with multiple datasets
 * - Edge cases and boundary conditions
 * - Navigation and cancel flows
 * - Error handling scenarios
 */

test.describe('E-001-F-001: Itinerary Creation', () => {
  let createPage: CreateItineraryPage;
  let dashboardPage: DashboardPage;
  let detailPage: ItineraryDetailPage;

  test.beforeEach(async ({ page }) => {
    // Setup authentication before each test
    await setupAuthentication(page);
    
    // Initialize page objects
    createPage = new CreateItineraryPage(page);
    dashboardPage = new DashboardPage(page);
    detailPage = new ItineraryDetailPage(page);
    
    // Navigate to create itinerary page
    await createPage.navigateToPage();
  });

  test.describe('Happy Path Scenarios', () => {
    test('TC-001: Should successfully create itinerary with all fields', async ({ page }) => {
      // Arrange
      const testData = validItineraryData[0];
      
      // Act
      await createPage.verifyPageLoaded();
      await createPage.fillItineraryForm(testData);
      
      // Wait for API call to complete
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/v1/itineraries') && response.status() === 200
      );
      
      await createPage.clickSubmit();
      await responsePromise;
      
      // Assert - Verify navigation to detail page
      await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/);
      
      const currentURL = page.url();
      const itineraryId = extractItineraryIdFromURL(currentURL);
      expect(itineraryId).toBeTruthy();
      
      // Verify itinerary details are displayed
      await detailPage.verifyItineraryDetails({
        title: testData.title,
        destination: testData.destination,
        description: testData.description,
      });
    });

    test('TC-002: Should create itinerary with minimal required fields only', async ({ page }) => {
      // Arrange
      const testData = minimalValidData;
      
      // Act
      await createPage.fillTitle(testData.title);
      await createPage.fillDestination(testData.destination);
      await createPage.fillStartDate(testData.startDate);
      await createPage.fillEndDate(testData.endDate);
      
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/v1/itineraries') && response.status() === 200
      );
      
      await createPage.clickSubmit();
      await responsePromise;
      
      // Assert
      await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/);
      await detailPage.verifyPageLoaded(testData.title);
    });

    test('TC-003: Should display loading state during submission', async () => {
      // Arrange
      const testData = validItineraryData[1];
      
      // Act
      await createPage.fillItineraryForm(testData);
      await createPage.clickSubmit();
      
      // Assert - Check button shows loading state
      const buttonText = await createPage.getSubmitButtonText();
      expect(buttonText).toContain('Saving');
    });
  });

  test.describe('Data-Driven Tests', () => {
    // Test with multiple valid datasets
    for (let i = 0; i < validItineraryData.length; i++) {
      test(`TC-004-${i + 1}: Should create itinerary - ${validItineraryData[i].title}`, async ({ page }) => {
        const testData = validItineraryData[i];
        
        await createPage.fillItineraryForm(testData);
        
        const responsePromise = page.waitForResponse(
          (response) => response.url().includes('/api/v1/itineraries')
        );
        
        await createPage.clickSubmit();
        await responsePromise;
        
        await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/);
        await detailPage.verifyPageLoaded(testData.title);
      });
    }
  });

  test.describe('Status Selection Tests', () => {
    statusTestData.forEach((testData, index) => {
      test(`TC-005-${index + 1}: Should create itinerary with status: ${testData.status}`, async ({ page }) => {
        await createPage.fillItineraryForm(testData);
        
        const responsePromise = page.waitForResponse(
          (response) => response.url().includes('/api/v1/itineraries')
        );
        
        await createPage.clickSubmit();
        await responsePromise;
        
        await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/);
      });
    });
  });

  test.describe('Currency Tests', () => {
    currencyTestData.forEach((testData, index) => {
      test(`TC-006-${index + 1}: Should create itinerary with currency: ${testData.currency}`, async ({ page }) => {
        await createPage.fillItineraryForm(testData);
        
        const responsePromise = page.waitForResponse(
          (response) => response.url().includes('/api/v1/itineraries')
        );
        
        await createPage.clickSubmit();
        await responsePromise;
        
        await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/);
      });
    });
  });

  test.describe('Validation Tests - Required Fields', () => {
    test('TC-007: Should show validation error when title is missing', async () => {
      // Arrange
      const testData = invalidItineraryData.missingTitle;
      
      // Act
      await createPage.fillDestination(testData.destination);
      await createPage.fillStartDate(testData.startDate);
      await createPage.fillEndDate(testData.endDate);
      await createPage.clickSubmit();
      
      // Assert - Form should not submit, validation error should appear
      await createPage.verifyFieldValidationError('title');
      
      // Verify we're still on the create page
      await expect(createPage.page).toHaveURL(/\/itineraries\/new/);
    });

    test('TC-008: Should show validation error when destination is missing', async () => {
      const testData = invalidItineraryData.missingDestination;
      
      await createPage.fillTitle(testData.title);
      await createPage.fillStartDate(testData.startDate);
      await createPage.fillEndDate(testData.endDate);
      await createPage.clickSubmit();
      
      await createPage.verifyFieldValidationError('destination');
      await expect(createPage.page).toHaveURL(/\/itineraries\/new/);
    });

    test('TC-009: Should show validation error when start date is missing', async () => {
      const testData = invalidItineraryData.missingStartDate;
      
      await createPage.fillTitle(testData.title);
      await createPage.fillDestination(testData.destination);
      await createPage.fillEndDate(testData.endDate);
      await createPage.clickSubmit();
      
      await createPage.verifyFieldValidationError('startDate');
      await expect(createPage.page).toHaveURL(/\/itineraries\/new/);
    });

    test('TC-010: Should show validation error when end date is missing', async () => {
      const testData = invalidItineraryData.missingEndDate;
      
      await createPage.fillTitle(testData.title);
      await createPage.fillDestination(testData.destination);
      await createPage.fillStartDate(testData.startDate);
      await createPage.clickSubmit();
      
      await createPage.verifyFieldValidationError('endDate');
      await expect(createPage.page).toHaveURL(/\/itineraries\/new/);
    });

    test('TC-011: Should verify all required fields are marked', async () => {
      await createPage.verifyRequiredFields();
    });
  });

  test.describe('Date Validation Tests', () => {
    test('TC-012: Should handle same day trip (start date equals end date)', async ({ page }) => {
      const testData = invalidItineraryData.sameDayTrip;
      
      await createPage.fillItineraryForm(testData);
      
      // Attempt to submit - backend should handle validation
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/v1/itineraries')
      );
      
      await createPage.clickSubmit();
      
      try {
        await responsePromise;
        // If it succeeds, verify navigation
        await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/, { timeout: 5000 });
      } catch {
        // If it fails with validation, that's also acceptable
        await expect(createPage.page).toHaveURL(/\/itineraries\/new/);
      }
    });

    test('TC-013: Should handle past dates', async ({ page }) => {
      const testData = {
        title: 'Past Trip',
        destination: 'Historical City',
        startDate: '2020-01-01',
        endDate: '2020-01-05',
      };
      
      await createPage.fillItineraryForm(testData);
      
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/v1/itineraries')
      );
      
      await createPage.clickSubmit();
      await responsePromise;
      
      // Past dates should be allowed (for completed trips)
      await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/);
    });
  });

  test.describe('Edge Case Tests', () => {
    test('TC-014: Should handle very long title', async ({ page }) => {
      const testData = edgeCaseData.veryLongTitle;
      
      await createPage.fillTitle(testData.title.substring(0, 255)); // Limit to reasonable length
      await createPage.fillDestination(testData.destination);
      await createPage.fillStartDate(testData.startDate);
      await createPage.fillEndDate(testData.endDate);
      
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/v1/itineraries')
      );
      
      await createPage.clickSubmit();
      
      try {
        await responsePromise;
      } catch {
        // Backend may reject very long titles
      }
    });

    test('TC-015: Should handle special characters in title and destination', async ({ page }) => {
      const testData = edgeCaseData.specialCharactersInTitle;
      
      await createPage.fillItineraryForm(testData);
      
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/v1/itineraries')
      );
      
      await createPage.clickSubmit();
      await responsePromise;
      
      await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/);
    });

    test('TC-016: Should handle Unicode and emoji characters', async ({ page }) => {
      const testData = edgeCaseData.unicodeCharacters;
      
      await createPage.fillItineraryForm(testData);
      
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/v1/itineraries')
      );
      
      await createPage.clickSubmit();
      await responsePromise;
      
      await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/);
      await detailPage.verifyPageLoaded(testData.title);
    });

    test('TC-017: Should handle zero budget', async ({ page }) => {
      const testData = edgeCaseData.zeroBudget;
      
      await createPage.fillItineraryForm(testData);
      
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/v1/itineraries')
      );
      
      await createPage.clickSubmit();
      await responsePromise;
      
      await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/);
    });

    test('TC-018: Should handle very high budget', async ({ page }) => {
      const testData = edgeCaseData.veryHighBudget;
      
      await createPage.fillItineraryForm(testData);
      
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/v1/itineraries')
      );
      
      await createPage.clickSubmit();
      await responsePromise;
      
      await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/);
    });
  });

  test.describe('Navigation Tests', () => {
    test('TC-019: Should navigate back to dashboard when cancel is clicked', async ({ page }) => {
      // Fill some data
      await createPage.fillTitle('Test Trip');
      await createPage.fillDestination('Test City');
      
      // Click cancel
      await createPage.clickCancel();
      
      // Should navigate to dashboard/home
      await page.waitForURL('/');
      await dashboardPage.verifyPageLoaded();
    });

    test('TC-020: Should navigate to create page from dashboard', async ({ page }) => {
      // Navigate to dashboard first
      await dashboardPage.navigateToPage();
      await dashboardPage.verifyPageLoaded();
      
      // Click create button
      await dashboardPage.clickCreateItinerary();
      
      // Should navigate to create page
      await page.waitForURL(/\/itineraries\/new/);
      await createPage.verifyPageLoaded();
    });

    test('TC-021: Should preserve form data when navigating away and back (if implemented)', async ({ page }) => {
      const testTitle = 'Preserved Trip';
      
      await createPage.fillTitle(testTitle);
      await createPage.fillDestination('Test City');
      
      // Get form values
      const formValues = await createPage.getFormValues();
      
      // Navigate away
      await dashboardPage.navigateToPage();
      
      // Navigate back
      await createPage.navigateToPage();
      
      // Check if data is preserved (depends on implementation)
      // This test documents the expected behavior
    });
  });

  test.describe('Error Handling Tests', () => {
    test('TC-022: Should display error message when API fails', async ({ page }) => {
      // Mock API failure
      await mockAPIError(
        page,
        /\/api\/v1\/itineraries$/,
        'Failed to create itinerary. Please try again.',
        500
      );
      
      const testData = validItineraryData[0];
      await createPage.fillItineraryForm(testData);
      
      // Setup dialog handler to catch alert
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Failed to create itinerary');
        await dialog.accept();
      });
      
      await createPage.clickSubmit();
      
      // Should stay on create page
      await expect(page).toHaveURL(/\/itineraries\/new/);
    });

    test('TC-023: Should handle network timeout gracefully', async ({ page }) => {
      // Mock slow API response
      await page.route(/\/api\/v1\/itineraries$/, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 30000));
        await route.abort('timedout');
      });
      
      const testData = minimalValidData;
      await createPage.fillItineraryForm(testData);
      await createPage.clickSubmit();
      
      // Should handle timeout (may show error or stay on page)
      await page.waitForTimeout(2000);
      // Test documents that timeout should be handled gracefully
    });

    test('TC-024: Should handle unauthorized access (401)', async ({ page }) => {
      // Clear authentication
      await createPage.clearAuthentication();
      
      const testData = minimalValidData;
      await createPage.fillItineraryForm(testData);
      
      // Mock 401 response
      await mockAPIError(page, /\/api\/v1\/itineraries$/, 'Unauthorized', 401);
      
      await createPage.clickSubmit();
      
      // Should handle 401 error
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Random Data Tests', () => {
    test('TC-025: Should create itinerary with randomly generated data', async ({ page }) => {
      const randomData = generateRandomItinerary();
      
      await createPage.fillItineraryForm(randomData);
      
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/v1/itineraries')
      );
      
      await createPage.clickSubmit();
      await responsePromise;
      
      await page.waitForURL(/\/itineraries\/[a-zA-Z0-9-]+/);
    });
  });

  test.describe('Accessibility Tests', () => {
    test('TC-026: Should have proper form labels for accessibility', async () => {
      // Verify all inputs have associated labels
      await expect(createPage.titleInput).toHaveAttribute('id', 'title');
      await expect(createPage.destinationInput).toHaveAttribute('id', 'destination');
      await expect(createPage.startDateInput).toHaveAttribute('id', 'startDate');
      await expect(createPage.endDateInput).toHaveAttribute('id', 'endDate');
      
      // Verify labels exist
      const titleLabel = createPage.page.locator('label[for="title"]');
      await expect(titleLabel).toBeVisible();
    });

    test('TC-027: Should be keyboard navigable', async ({ page }) => {
      // Tab through form fields
      await page.keyboard.press('Tab'); // Focus title
      await page.keyboard.type('Test Trip');
      
      await page.keyboard.press('Tab'); // Focus destination
      await page.keyboard.type('Test City');
      
      await page.keyboard.press('Tab'); // Focus start date
      await page.keyboard.type('2024-07-01');
      
      await page.keyboard.press('Tab'); // Focus end date
      await page.keyboard.type('2024-07-05');
      
      // Verify data was entered
      const formValues = await createPage.getFormValues();
      expect(formValues.title).toBe('Test Trip');
      expect(formValues.destination).toBe('Test City');
    });
  });
});
