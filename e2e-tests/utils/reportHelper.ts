import * as fs from 'fs';
import * as path from 'path';

/**
 * Report Helper utility for test reporting
 */
export class ReportHelper {
  private static reportDir = 'test-results/custom-reports';

  /**
   * Initialize report directory
   */
  static initReportDirectory(): void {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  /**
   * Log test result to file
   */
  static logTestResult(testName: string, status: string, duration: number, error?: string): void {
    this.initReportDirectory();
    
    const result = {
      testName,
      status,
      duration,
      timestamp: new Date().toISOString(),
      error: error || null,
    };

    const fileName = `test-log-${Date.now()}.json`;
    const filePath = path.join(this.reportDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
  }

  /**
   * Save screenshot with metadata
   */
  static async saveScreenshotWithMetadata(
    screenshot: Buffer,
    testName: string,
    metadata: Record<string, any>
  ): Promise<string> {
    this.initReportDirectory();
    
    const screenshotDir = path.join(this.reportDir, 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const fileName = `${testName.replace(/\s+/g, '-')}-${Date.now()}.png`;
    const filePath = path.join(screenshotDir, fileName);
    
    fs.writeFileSync(filePath, screenshot);

    // Save metadata
    const metadataPath = filePath.replace('.png', '.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    return filePath;
  }

  /**
   * Generate test summary
   */
  static generateTestSummary(results: Array<{ name: string; status: string; duration: number }>): void {
    this.initReportDirectory();
    
    const summary = {
      totalTests: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
      timestamp: new Date().toISOString(),
      results,
    };

    const filePath = path.join(this.reportDir, 'test-summary.json');
    fs.writeFileSync(filePath, JSON.stringify(summary, null, 2));
  }
}
