import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly signUpLink: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly pageHeader: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.emailInput = page.locator('[data-testid="email-input"], #email, input[type="email"]').first();
    this.passwordInput = page.locator('[data-testid="password-input"], #password, input[type="password"]').first();
    this.loginButton = page.locator('[data-testid="login-button"], button[type="submit"]').first();
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-error').first();
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password"], a:has-text("Forgot Password")').first();
    this.signUpLink = page.locator('[data-testid="signup-link"], a:has-text("Sign Up")').first();
    this.rememberMeCheckbox = page.locator('[data-testid="remember-me"], input[type="checkbox"]').first();
    this.pageHeader = page.locator('[data-testid="login-header"], h1, h2').first();
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }

  /**
   * Perform login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  /**
   * Login with remember me option
   */
  async loginWithRememberMe(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.rememberMeCheckbox.check();
    await this.clickElement(this.loginButton);
  }

  /**
   * Enter email
   */
  async enterEmail(email: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  /**
   * Click sign up link
   */
  async clickSignUp(): Promise<void> {
    await this.clickElement(this.signUpLink);
  }

  /**
   * Verify login page is loaded
   */
  async verifyLoginPageLoaded(): Promise<void> {
    await this.waitForElement(this.emailInput);
    await this.waitForElement(this.passwordInput);
    await this.waitForElement(this.loginButton);
  }

  /**
   * Get page header text
   */
  async getPageHeader(): Promise<string> {
    return await this.getElementText(this.pageHeader);
  }
}
