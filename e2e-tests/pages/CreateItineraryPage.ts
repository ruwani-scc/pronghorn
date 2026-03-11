import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CreateItineraryData } from '../test-data/itinerary-data';

/**
 * CreateItineraryPage - Page Object Model for Create Itinerary page
 * Represents /itinerary/new route
 */
export class CreateItineraryPage extends BasePage {
  // Page elements
  readonly pageHeader: Locator;
  readonly pageSubtitle: Locator;
  readonly titleInput: Locator;
  readonly destinationInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly descriptionTextarea: Locator;
  readonly statusSelect: Locator;
  readonly currencySelect: Locator;
  readonly budgetInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize page elements
    this.pageHeader = page.locator('h1:has-text("Create New Itinerary")');
    this.pageSubtitle = page.locator('p:has-text("Start planning your next adventure")');
    this.titleInput = page.locator('input#title');
    this.destinationInput = page.locator('input#destination');
    this.startDateInput = page.locator('input#startDate');
    this.endDateInput = page.locator('input#endDate');
    this.descriptionTextarea = page.locator('textarea#description');
    this.statusSelect = page.locator('select#status');
    this.currencySelect = page.locator('select#currency');
    this.budgetInput = page.locator('input#budget');
    this.submitButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.form = page.locator('form.itinerary-form');
  }

  /**
   * Navigate to Create Itinerary page
   */
  async navigateToPage(): Promise<void> {
    await this.goto('/itineraries/new');
    await this.waitForPageLoad();
  }

  /**
   * Verify page is loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageHeader).toBeVisible();
    await expect(this.pageSubtitle).toBeVisible();
    await expect(this.form).toBeVisible();
  }

  /**
   * Fill title field
   */
  async fillTitle(title: string): Promise<void> {
    await this.fillInput(this.titleInput, title);
  }

  /**
   * Fill destination field
   */
  async fillDestination(destination: string): Promise<void> {
    await this.fillInput(this.destinationInput, destination);
  }

  /**
   * Fill start date field
   */
  async fillStartDate(date: string): Promise<void> {
    await this.fillInput(this.startDateInput, date);
  }

  /**
   * Fill end date field
   */
  async fillEndDate(date: string): Promise<void> {
    await this.fillInput(this.endDateInput, date);
  }

  /**
   * Fill description field
   */
  async fillDescription(description: string): Promise<void> {
    await this.fillInput(this.descriptionTextarea, description);
  }

  /**
   * Select status
   */
  async selectStatus(status: string): Promise<void> {
    await this.selectOption(this.statusSelect, status);
  }

  /**
   * Select currency
   */
  async selectCurrency(currency: string): Promise<void> {
    await this.selectOption(this.currencySelect, currency);
  }

  /**
   * Fill budget field
   */
  async fillBudget(budget: string): Promise<void> {
    await this.fillInput(this.budgetInput, budget);
  }

  /**
   * Fill complete itinerary form with data object
   */
  async fillItineraryForm(data: CreateItineraryData): Promise<void> {
    await this.fillTitle(data.title);
    await this.fillDestination(data.destination);
    await this.fillStartDate(data.startDate);
    await this.fillEndDate(data.endDate);
    
    if (data.description) {
      await this.fillDescription(data.description);
    }
    
    if (data.status) {
      await this.selectStatus(data.status);
    }
    
    if (data.currency) {
      await this.selectCurrency(data.currency);
    }
    
    if (data.budget) {
      await this.fillBudget(data.budget.toString());
    }
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.clickElement(this.submitButton);
  }

  /**
   * Click cancel button
   */
  async clickCancel(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }

  /**
   * Submit form (fill and submit)
   */
  async submitItinerary(data: CreateItineraryData): Promise<void> {
    await this.fillItineraryForm(data);
    await this.clickSubmit();
  }

  /**
   * Verify submit button is disabled
   */
  async verifySubmitButtonDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  /**
   * Verify submit button is enabled
   */
  async verifySubmitButtonEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
  }

  /**
   * Get submit button text
   */
  async getSubmitButtonText(): Promise<string> {
    return await this.getTextContent(this.submitButton);
  }

  /**
   * Verify validation error for field
   */
  async verifyFieldValidationError(fieldName: string): Promise<void> {
    const field = this.page.locator(`#${fieldName}`);
    await expect(field).toHaveAttribute('required', '');
    
    // Check HTML5 validation message
    const validationMessage = await field.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  }

  /**
   * Verify required fields are marked
   */
  async verifyRequiredFields(): Promise<void> {
    await expect(this.titleInput).toHaveAttribute('required', '');
    await expect(this.destinationInput).toHaveAttribute('required', '');
    await expect(this.startDateInput).toHaveAttribute('required', '');
    await expect(this.endDateInput).toHaveAttribute('required', '');
  }

  /**
   * Get form data values
   */
  async getFormValues(): Promise<Record<string, string>> {
    return {
      title: await this.titleInput.inputValue(),
      destination: await this.destinationInput.inputValue(),
      startDate: await this.startDateInput.inputValue(),
      endDate: await this.endDateInput.inputValue(),
      description: await this.descriptionTextarea.inputValue(),
      status: await this.statusSelect.inputValue(),
      currency: await this.currencySelect.inputValue(),
      budget: await this.budgetInput.inputValue(),
    };
  }

  /**
   * Verify alert message appears
   */
  async verifyAlertMessage(expectedMessage: string): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain(expectedMessage);
      await dialog.accept();
    });
  }

  /**
   * Clear form
   */
  async clearForm(): Promise<void> {
    await this.titleInput.clear();
    await this.destinationInput.clear();
    await this.startDateInput.clear();
    await this.endDateInput.clear();
    await this.descriptionTextarea.clear();
    await this.budgetInput.clear();
  }
}
