import { defineConfig, devices } from '@playwright/test';

/**
 * Full Solution Web - E2E Test Configuration
 * Tests run against local dev server (http://localhost:8080) by default
 * Set BASE_URL env var to test deployed site
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/full-solution-vip-ui';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'cd .. && npm run dev',
    url: 'http://localhost:8080/full-solution-vip-ui/',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
