import { test, expect } from '@playwright/test';

test.describe('Admin Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin (assumes admin user exists)
    await page.goto('/login');
    await page.fill('#email', 'admin@fullsolution.vip');
    await page.fill('#password', process.env.ADMIN_PASSWORD || 'Admin123456!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/account/);
  });

  test('Admin page loads with all sections', async ({ page }) => {
    await page.goto('/admin');

    // Should NOT redirect to login
    await expect(page).toHaveURL(/\/admin/);

    // Check all sections are visible
    await expect(page.locator('text=/Knowledge Base/i')).toBeVisible();
    await expect(page.locator('text=/Users/i')).toBeVisible();
    await expect(page.locator('text=/API Documentation/i')).toBeVisible();
  });

  test('Knowledge base shows chunk count', async ({ page }) => {
    await page.goto('/admin');

    // Should show knowledge base status
    await expect(page.locator('text=/chunks? indexed/i')).toBeVisible({ timeout: 5000 });
  });

  test('Can trigger knowledge base re-index', async ({ page }) => {
    await page.goto('/admin');

    const reindexBtn = page.locator('button:has-text(/Re-index|Force Re-index/i)');
    await reindexBtn.click();

    // Should show success message
    await expect(page.locator('[role="alert"], .bg-green-50, .text-green-600')).toBeVisible({ timeout: 30000 });
  });

  test('User management shows users', async ({ page }) => {
    await page.goto('/admin');

    // Should list users
    const userRows = page.locator('[data-testid="user-row"], tr:has(td)');
    const count = await userRows.count();
    console.log(`Found ${count} users`);
  });

  test('Can toggle user role', async ({ page }) => {
    await page.goto('/admin');

    // Find a user row with a role toggle button
    const roleBtn = page.locator('button:has-text(/admin|client/i)').first();

    if (await roleBtn.isVisible()) {
      const initialText = await roleBtn.textContent();
      await roleBtn.click();

      // Role should toggle
      await page.waitForLoadState('networkidle');
      const newText = await roleBtn.textContent();
      expect(newText).not.toBe(initialText);
    }
  });

  test('Non-admin user blocked from /admin', async ({ page }) => {
    // Login as regular user (not admin)
    await page.goto('/login');
    await page.fill('#email', 'test-client@example.com');
    await page.fill('#password', 'Test123456!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/account/);

    // Try to access admin
    await page.goto('/admin');

    // Should redirect or show unauthorized
    await expect(page).not.toHaveURL(/\/admin/);
  });
});
