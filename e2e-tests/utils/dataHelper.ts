import * as fs from 'fs';
import * as path from 'path';

/**
 * Data Helper utility for loading test data
 */
export class DataHelper {
  /**
   * Load JSON data from file
   */
  static loadTestData<T>(fileName: string): T {
    const filePath = path.join(__dirname, '../data', fileName);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData) as T;
  }

  /**
   * Load users data
   */
  static loadUsers() {
    return this.loadTestData<{
      validUsers: Array<{
        email: string;
        password: string;
        role: string;
        expectedMessage: string;
      }>;
      invalidUsers: Array<{
        email: string;
        password: string;
        expectedError: string;
      }>;
    }>('users.json');
  }

  /**
   * Load general test data
   */
  static loadGeneralTestData() {
    return this.loadTestData<{
      searchQueries: Array<{
        query: string;
        expectedResults: number;
      }>;
      dashboardFilters: Array<{
        filterText: string;
        expectedCount: number;
      }>;
      formData: Array<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        message: string;
      }>;
    }>('testData.json');
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    return `test.user.${timestamp}@example.com`;
  }

  /**
   * Generate random string
   */
  static generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate random number in range
   */
  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
