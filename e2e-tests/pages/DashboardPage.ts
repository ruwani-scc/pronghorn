import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Dashboard Page Object Model
 */
export class DashboardPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly statsCards: Locator;
  private readonly createButton: Locator;
  private readonly dataTable: Locator;
  private readonly tableRows: Locator;
  private readonly filterInput: Locator;
  private readonly sortDropdown: Locator;
  private readonly paginationNext: Locator;
  private readonly paginationPrevious: Locator;
  private readonly refreshButton: Locator;
  private readonly exportButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.pageTitle = page.locator('[data-testid="dashboard-title"], h1:has-text("Dashboard")').first();
    this.statsCards = page.locator('[data-testid="stats-card"], .stats-card');
    this.createButton = page.locator('[data-testid="create-button"], button:has-text("Create")').first();
    this.dataTable = page.locator('[data-testid="data-table"], table').first();
    this.tableRows = page.locator('[data-testid="table-row"], tbody tr');
    this.filterInput = page.locator('[data-testid="filter-input"], input[placeholder*="Filter"]').first();
    this.sortDropdown = page.locator('[data-testid="sort-dropdown"], select').first();
    this.paginationNext = page.locator('[data-testid="pagination-next"], button:has-text("Next")').first();
    this.paginationPrevious = page.locator('[data-testid="pagination-previous"], button:has-text("Previous")').first();
    this.refreshButton = page.locator('[data-testid="refresh-button"], button:has-text("Refresh")').first();
    this.exportButton = page.locator('[data-testid="export-button"], button:has-text("Export")').first();
  }

  /**
   * Navigate to dashboard page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/dashboard');
    await this.waitForPageLoad();
  }

  /**
   * Verify dashboard page is loaded
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.waitForElement(this.pageTitle);
    await this.verifyUrlContains('/dashboard');
  }

  /**
   * Get number of stats cards
   */
  async getStatsCardCount(): Promise<number> {
    return await this.statsCards.count();
  }

  /**
   * Get stats card value by index
   */
  async getStatsCardValue(index: number): Promise<string> {
    const card = this.statsCards.nth(index);
    return await this.getElementText(card);
  }

  /**
   * Click create button
   */
  async clickCreate(): Promise<void> {
    await this.clickElement(this.createButton);
  }

  /**
   * Get number of table rows
   */
  async getTableRowCount(): Promise<number> {
    await this.waitForElement(this.dataTable);
    return await this.tableRows.count();
  }

  /**
   * Get table row data by index
   */
  async getTableRowData(rowIndex: number): Promise<string[]> {
    const row = this.tableRows.nth(rowIndex);
    const cells = row.locator('td');
    const count = await cells.count();
    const data: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await cells.nth(i).textContent();
      data.push(text || '');
    }
    
    return data;
  }

  /**
   * Filter table data
   */
  async filterTable(filterText: string): Promise<void> {
    await this.fillInput(this.filterInput, filterText);
    await this.page.waitForTimeout(500); // Wait for filter to apply
  }

  /**
   * Sort table by option
   */
  async sortTable(sortOption: string): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
    await this.page.waitForTimeout(500); // Wait for sort to apply
  }

  /**
   * Click next page
   */
  async goToNextPage(): Promise<void> {
    await this.clickElement(this.paginationNext);
  }

  /**
   * Click previous page
   */
  async goToPreviousPage(): Promise<void> {
    await this.clickElement(this.paginationPrevious);
  }

  /**
   * Refresh dashboard data
   */
  async refreshData(): Promise<void> {
    await this.clickElement(this.refreshButton);
    await this.waitForPageLoad();
  }

  /**
   * Export data
   */
  async exportData(): Promise<void> {
    await this.clickElement(this.exportButton);
  }

  /**
   * Click on table row by index
   */
  async clickTableRow(rowIndex: number): Promise<void> {
    await this.tableRows.nth(rowIndex).click();
  }

  /**
   * Verify table is visible
   */
  async verifyTableVisible(): Promise<void> {
    await this.waitForElement(this.dataTable);
  }
}
