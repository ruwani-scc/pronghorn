import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage - Page Object Model for Dashboard page
 * Represents / (root) route showing list of itineraries
 */
export class DashboardPage extends BasePage {
  // Page elements
  readonly pageTitle: Locator;
  readonly createButton: Locator;
  readonly itineraryCards: Locator;
  readonly searchInput: Locator;
  readonly filterSelect: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize page elements
    this.pageTitle = page.locator('h1');
    this.createButton = page.locator('a[href="/itineraries/new"], button:has-text("Create")');
    this.itineraryCards = page.locator('.itinerary-card');
    this.searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    this.filterSelect = page.locator('select[name="filter"]');
  }

  /**
   * Navigate to Dashboard page
   */
  async navigateToPage(): Promise<void> {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Verify page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
  }

  /**
   * Click create new itinerary button
   */
  async clickCreateItinerary(): Promise<void> {
    await this.clickElement(this.createButton);
  }

  /**
   * Get count of itinerary cards
   */
  async getItineraryCount(): Promise<number> {
    return await this.itineraryCards.count();
  }

  /**
   * Verify itinerary appears in list
   */
  async verifyItineraryExists(title: string): Promise<void> {
    const itinerary = this.page.locator(`.itinerary-card:has-text("${title}")`);
    await expect(itinerary).toBeVisible();
  }

  /**
   * Click on itinerary card by title
   */
  async clickItinerary(title: string): Promise<void> {
    const itinerary = this.page.locator(`.itinerary-card:has-text("${title}")`);
    await this.clickElement(itinerary);
  }

  /**
   * Search for itinerary
   */
  async searchItinerary(searchTerm: string): Promise<void> {
    if (await this.isVisible(this.searchInput)) {
      await this.fillInput(this.searchInput, searchTerm);
      await this.waitForPageLoad();
    }
  }
}
