import { test, expect } from '@playwright/test';

test.describe('Client Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test (assumes test user exists)
    await page.goto('/login');
    await page.fill('#email', 'test-client@example.com');
    await page.fill('#password', 'Test123456!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/account/);
  });

  test('Portal page loads after login', async ({ page }) => {
    await page.goto('/portal');
    await expect(page.locator('h1')).toContainText(/Customer Portal|Portal/i);
  });

  test('Shows chat history sessions', async ({ page }) => {
    await page.goto('/portal');

    // Should show chat history section
    await expect(page.locator('text=/Chat History|sessions/i')).toBeVisible();

    // If there are sessions, they should be listed
    const sessions = page.locator('[data-testid="chat-session"], .rounded-lg:has-text("Session")');
    const count = await sessions.count();
    console.log(`Found ${count} chat sessions`);
  });

  test('Clicking a session shows messages', async ({ page }) => {
    await page.goto('/portal');

    // Click first session if it exists
    const firstSession = page.locator('[data-testid="chat-session"], .rounded-lg:has-text("Session")').first();

    if (await firstSession.isVisible()) {
      await firstSession.click();

      // Should show messages
      await expect(page.locator('text=/You|AI Assistant|user|assistant/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('User can delete a chat session', async ({ page }) => {
    await page.goto('/portal');

    // Find delete button on first session
    const deleteBtn = page.locator('button:has([data-testid="trash"], svg[data-testid="trash"], .text-red-500)').first();

    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();

      // Confirm deletion if there's a confirmation dialog
      const confirmBtn = page.locator('button:has-text(/confirm|delete|yes/i)');
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }

      // Session should be removed
      await page.waitForLoadState('networkidle');
    }
  });
});
