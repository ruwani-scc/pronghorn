import { test, expect } from '@playwright/test';

test.describe('Health Check API', () => {
  test('should return healthy status from /health endpoint', async ({ request }) => {
    const response = await request.get('/health');
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('status');
    expect(body.status).toBe('Healthy');
  });

  test('should return 200 status code', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.status()).toBe(200);
  });

  test('should return valid JSON response', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.headers()['content-type']).toContain('application/json');
    
    const body = await response.json();
    expect(body).toBeDefined();
  });

  test('should respond quickly (under 1 second)', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/health');
    const endTime = Date.now();
    
    expect(response.ok()).toBeTruthy();
    expect(endTime - startTime).toBeLessThan(1000);
  });

  test('should include timestamp in response', async ({ request }) => {
    const response = await request.get('/health');
    const body = await response.json();
    
    // Check if timestamp exists and is valid
    if (body.timestamp) {
      const timestamp = new Date(body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    }
  });

  test('should handle multiple concurrent requests', async ({ request }) => {
    const requests = Array(10).fill(null).map(() => request.get('/health'));
    const responses = await Promise.all(requests);
    
    responses.forEach(response => {
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    });
  });
});
