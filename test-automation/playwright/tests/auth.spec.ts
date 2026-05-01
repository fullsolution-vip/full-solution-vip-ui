import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  const timestamp = Date.now();
  const testEmail = `frederick1989+cosmetic-test-${timestamp}@gmail.com`;
  const testPassword = 'Test123456!';

  test('User can sign up with email and password', async ({ page }) => {
    await page.goto('/signup');

    // Fill signup form
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', testPassword);
    await page.check('#terms');

    // Submit
    await page.click('button[type="submit"]');

    // Should redirect to login with success message
    await expect(page).toHaveURL(/\/login.*registered=true/);

    // Verify success message is shown
    await expect(page.locator('.bg-green-50, .text-green-600, [role="alert"]')).toBeVisible({ timeout: 5000 });
  });

  test('Login with valid credentials', async ({ page }) => {
    // Note: This test assumes the user from the signup test exists
    // In practice, create the user via API before running
    // For now, we'll skip if user doesn't exist
    await page.goto('/login');

    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);

    await page.click('button[type="submit"]');

    // Should redirect to account page
    await expect(page).toHaveURL(/\/account/);
  });

  test('Login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');

    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'wrongpass');

    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('.bg-error, .text-error, [role="alert"]')).toBeVisible({ timeout: 5000 });
  });

  test('Logout clears session and redirects', async ({ page }) => {
    // Login first (assumes authenticated state)
    await page.goto('/login');
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/account/);

    // Click logout
    await page.click('button:has-text("Sign Out")');

    // Should redirect to home
    await expect(page).toHaveURL(/\/$/);
  });

  test('Unauthenticated user redirected from /portal', async ({ page }) => {
    await page.goto('/portal');

    // Should redirect to login or show unauthorized
    await expect(page).toHaveURL(/\/login/);
  });

  test('Unauthenticated user redirected from /admin', async ({ page }) => {
    await page.goto('/admin');

    // Should redirect to login or show unauthorized
    await expect(page).toHaveURL(/\/login/);
  });
});
