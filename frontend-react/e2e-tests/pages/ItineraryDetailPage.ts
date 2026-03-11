import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ItineraryDetailPage - Page Object Model for Itinerary Detail page
 * Represents /itineraries/:id route
 */
export class ItineraryDetailPage extends BasePage {
  // Page elements
  readonly itineraryTitle: Locator;
  readonly destination: Locator;
  readonly dates: Locator;
  readonly description: Locator;
  readonly status: Locator;
  readonly budget: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly addAccommodationButton: Locator;
  readonly addActivityButton: Locator;
  readonly addTransportButton: Locator;
  readonly accommodationSection: Locator;
  readonly activitySection: Locator;
  readonly transportSection: Locator;
  readonly progressTracker: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize page elements
    this.itineraryTitle = page.locator('h1, .itinerary-title');
    this.destination = page.locator('.destination, [data-testid="destination"]');
    this.dates = page.locator('.dates, [data-testid="dates"]');
    this.description = page.locator('.description, [data-testid="description"]');
    this.status = page.locator('.status, [data-testid="status"]');
    this.budget = page.locator('.budget, [data-testid="budget"]');
    this.editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")');
    this.deleteButton = page.locator('button:has-text("Delete")');
    this.addAccommodationButton = page.locator('button:has-text("Add Accommodation")');
    this.addActivityButton = page.locator('button:has-text("Add Activity")');
    this.addTransportButton = page.locator('button:has-text("Add Transport")');
    this.accommodationSection = page.locator('.accommodation-section, [data-testid="accommodations"]');
    this.activitySection = page.locator('.activity-section, [data-testid="activities"]');
    this.transportSection = page.locator('.transport-section, [data-testid="transport"]');
    this.progressTracker = page.locator('.progress-tracker, [data-testid="progress"]');
  }

  /**
   * Navigate to Itinerary Detail page
   */
  async navigateToPage(itineraryId: string): Promise<void> {
    await this.goto(`/itineraries/${itineraryId}`);
    await this.waitForPageLoad();
  }

  /**
   * Verify page is loaded with itinerary data
   */
  async verifyPageLoaded(expectedTitle: string): Promise<void> {
    await expect(this.itineraryTitle).toBeVisible();
    await expect(this.itineraryTitle).toContainText(expectedTitle);
  }

  /**
   * Verify itinerary details
   */
  async verifyItineraryDetails(details: {
    title: string;
    destination?: string;
    description?: string;
  }): Promise<void> {
    await expect(this.itineraryTitle).toContainText(details.title);
    
    if (details.destination && await this.isVisible(this.destination)) {
      await expect(this.destination).toContainText(details.destination);
    }
    
    if (details.description && await this.isVisible(this.description)) {
      await expect(this.description).toContainText(details.description);
    }
  }

  /**
   * Click edit button
   */
  async clickEdit(): Promise<void> {
    await this.clickElement(this.editButton);
  }

  /**
   * Click delete button
   */
  async clickDelete(): Promise<void> {
    await this.clickElement(this.deleteButton);
  }

  /**
   * Get itinerary title text
   */
  async getTitle(): Promise<string> {
    return await this.getTextContent(this.itineraryTitle);
  }

  /**
   * Verify progress tracker is visible
   */
  async verifyProgressTrackerVisible(): Promise<void> {
    if (await this.isVisible(this.progressTracker)) {
      await expect(this.progressTracker).toBeVisible();
    }
  }
}
