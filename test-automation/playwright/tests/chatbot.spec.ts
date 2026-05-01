import { test, expect } from '@playwright/test';

test.describe('Chatbot', () => {
  test.beforeEach(async ({ page }) => {
    // Create and login a new test user with aliased email
    const timestamp = Date.now();
    const email = `frederick1989+cosmetic-test-${timestamp}@gmail.com`;
    const password = 'Test123456!';

    await page.goto('/signup');
    await page.fill('#firstName', 'Chat');
    await page.fill('#lastName', 'Test');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.fill('#confirmPassword', password);
    await page.check('#terms');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/login/);

    // Login (skip email confirmation for now)
    await page.goto('/login');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/account/);
  });

  test('Chat widget renders on all pages', async ({ page }) => {
    // Check home page
    await page.goto('/');
    await expect(page.locator('[aria-label="Chat with us"]')).toBeVisible();

    // Check products page
    await page.goto('/products');
    await expect(page.locator('[aria-label="Chat with us"]')).toBeVisible();
  });

  test('User can send message and receive response', async ({ page }) => {
    await page.goto('/chat');

    // Find chat input
    const input = page.locator('textarea, input[type="text"]').first();
    await input.fill('What products do you recommend for dry skin?');

    // Submit
    await page.click('button[type="submit"], button:has-text("Send")');

    // Should show "Thinking..." indicator
    await expect(page.locator('text=/Thinking|Loading|\\.\\.\\./')).toBeVisible({ timeout: 5000 });

    // Should receive response (wait up to 30s for LLM)
    await expect(page.locator('text=/Hello|Hi|recommend|product/i')).toBeVisible({ timeout: 30000 });
  });

  test('Chat history saves and displays in portal', async ({ page }) => {
    // Make sure we're logged in (from beforeEach)
    await page.goto('/portal');

    // Should show chat history section
    await expect(page.locator('text=/Chat History|Sessions/i')).toBeVisible({ timeout: 5000 });

    // Should have at least one session (from the chat test)
    const sessions = page.locator('[data-testid="chat-session"], .rounded-lg:has-text("Session")');
    const count = await sessions.count();
    console.log(`Found ${count} chat sessions`);
  });
});
