import { Page } from '@playwright/test';

/**
 * Wait Helper utility for custom wait conditions
 */
export class WaitHelper {
  /**
   * Wait for a specific amount of time
   */
  static async wait(milliseconds: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Wait until element count changes
   */
  static async waitForElementCountChange(
    page: Page,
    selector: string,
    initialCount: number,
    timeout: number = 10000
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const currentCount = await page.locator(selector).count();
      if (currentCount !== initialCount) {
        return;
      }
      await this.wait(100);
    }
    
    throw new Error(`Element count did not change within ${timeout}ms`);
  }

  /**
   * Wait for URL to contain text
   */
  static async waitForUrlContains(
    page: Page,
    text: string,
    timeout: number = 10000
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (page.url().includes(text)) {
        return;
      }
      await this.wait(100);
    }
    
    throw new Error(`URL did not contain "${text}" within ${timeout}ms`);
  }

  /**
   * Wait for page title to match
   */
  static async waitForTitle(
    page: Page,
    expectedTitle: string,
    timeout: number = 10000
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const title = await page.title();
      if (title === expectedTitle) {
        return;
      }
      await this.wait(100);
    }
    
    throw new Error(`Page title did not match "${expectedTitle}" within ${timeout}ms`);
  }

  /**
   * Wait for custom condition
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    errorMessage: string = 'Condition not met'
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await this.wait(100);
    }
    
    throw new Error(`${errorMessage} within ${timeout}ms`);
  }
}
