import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object Model
 */
export class HomePage extends BasePage {
  // Locators
  private readonly header: Locator;
  private readonly userMenu: Locator;
  private readonly logoutButton: Locator;
  private readonly searchInput: Locator;
  private readonly navigationMenu: Locator;
  private readonly welcomeMessage: Locator;
  private readonly profileLink: Locator;
  private readonly settingsLink: Locator;
  private readonly notificationBell: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.header = page.locator('[data-testid="home-header"], header').first();
    this.userMenu = page.locator('[data-testid="user-menu"], .user-menu').first();
    this.logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout")').first();
    this.searchInput = page.locator('[data-testid="search-input"], input[type="search"]').first();
    this.navigationMenu = page.locator('[data-testid="nav-menu"], nav').first();
    this.welcomeMessage = page.locator('[data-testid="welcome-message"], .welcome').first();
    this.profileLink = page.locator('[data-testid="profile-link"], a:has-text("Profile")').first();
    this.settingsLink = page.locator('[data-testid="settings-link"], a:has-text("Settings")').first();
    this.notificationBell = page.locator('[data-testid="notifications"], .notification-icon').first();
  }

  /**
   * Navigate to home page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  /**
   * Verify home page is loaded
   */
  async verifyHomePageLoaded(): Promise<void> {
    await this.waitForElement(this.header);
    await this.verifyUrlContains('/');
  }

  /**
   * Open user menu
   */
  async openUserMenu(): Promise<void> {
    await this.clickElement(this.userMenu);
  }

  /**
   * Logout from application
   */
  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.clickElement(this.logoutButton);
  }

  /**
   * Search for content
   */
  async search(query: string): Promise<void> {
    await this.fillInput(this.searchInput, query);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getElementText(this.welcomeMessage);
  }

  /**
   * Navigate to profile page
   */
  async goToProfile(): Promise<void> {
    await this.clickElement(this.profileLink);
  }

  /**
   * Navigate to settings page
   */
  async goToSettings(): Promise<void> {
    await this.clickElement(this.settingsLink);
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.userMenu);
  }

  /**
   * Click notification bell
   */
  async openNotifications(): Promise<void> {
    await this.clickElement(this.notificationBell);
  }

  /**
   * Verify navigation menu is visible
   */
  async verifyNavigationMenuVisible(): Promise<void> {
    await this.waitForElement(this.navigationMenu);
  }
}
