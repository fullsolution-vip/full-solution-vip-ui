import { test, expect } from '@playwright/test';

test.describe('Deployment & Health', () => {
  test('Health endpoint returns ok', async ({ page, request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.services).toBeDefined();
  });

  test('Site loads with HTTPS (if deployed)', async ({ page }) => {
    // This test makes sense for deployed site
    const url = page.url();
    if (url.includes('localhost')) {
      test.skip();
    }

    // Check for HTTPS padlock (no mixed content)
    const isHttps = url.startsWith('https://');
    expect(isHttps).toBe(true);
  });

  test('All routes load without 500 errors', async ({ page }) => {
    const routes = [
      '/',
      '/products',
      '/science',
      '/about',
      '/wholesale',
      '/contact',
      '/login',
      '/signup',
      '/chat',
    ];

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).not.toBe(500);
    }
  });

  test('Chat API responds', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        message: 'Hello, test message',
        sessionId: `test-session-${Date.now()}`,
      },
    });

    // Should return 200 or 400 (if invalid), not 500
    expect(response.status()).not.toBe(500);
  });

  test('Chatbot init API works', async ({ request }) => {
    const response = await request.post('/api/chatbot-init');
    // Should not return 500
    expect(response.status()).not.toBe(500);

    const body = await response.json();
    expect(body.success).toBeDefined();
  });
});
