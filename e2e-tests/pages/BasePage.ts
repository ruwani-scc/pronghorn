import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object Model class
 * All page objects should extend this class
 */
export class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  }

  /**
   * Navigate to a specific path
   */
  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click element with wait
   */
  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill input field
   */
  async fillInput(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Get element text
   */
  async getElementText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() || '';
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify element contains text
   */
  async verifyElementText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  /**
   * Verify URL contains path
   */
  async verifyUrlContains(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Reload current page
   */
  async reloadPage(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Go back to previous page
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }
}
