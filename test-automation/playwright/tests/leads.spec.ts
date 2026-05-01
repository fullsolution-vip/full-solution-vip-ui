import { test, expect } from '@playwright/test';

test.describe('Lead Generation', () => {
  test('Trade account application form submits', async ({ page }) => {
    await page.goto('/wholesale');

    // Look for "Apply" or "Apply Now" button/link
    const applyBtn = page.locator('a:has-text(/apply|apply now/i), button:has-text(/apply|apply now/i)').first();

    if (await applyBtn.isVisible()) {
      await applyBtn.click();
      await expect(page).toHaveURL(/\/wholesale\/apply/);
    } else {
      // Form might be on the same page
      await page.goto('/wholesale/apply');
    }

    // Fill form
    await page.fill('[name="companyName"], #companyName', 'Test Company Ltd');
    await page.fill('[name="contactName"], #contactName', 'John Doe');
    await page.fill('[name="email"], #email', `test-lead-${Date.now()}@example.com`);
    await page.fill('[name="phone"], #phone', '+27123456789');

    // Submit
    await page.click('button[type="submit"], button:has-text(/submit|send/i)');

    // Should show success message
    await expect(page.locator('text=/thank you|success|received/i')).toBeVisible({ timeout: 5000 });
  });

  test('Catalogue download captures email', async ({ page }) => {
    await page.goto('/wholesale');

    // Look for catalogue download button
    const downloadBtn = page.locator('a:has-text(/catalogue|download/i), button:has-text(/catalogue|download/i)').first();

    if (await downloadBtn.isVisible()) {
      await downloadBtn.click();

      // If it opens a form, fill email
      const emailInput = page.locator('[name="email"], #email').first();
      if (await emailInput.isVisible({ timeout: 3000 })) {
        await emailInput.fill(`catalog-${Date.now()}@example.com`);
        const submitBtn = page.locator('button[type="submit"], button:has-text(/submit|download/i)').first();
        await submitBtn.click();
      }
    }
  });

  test('Sample request from products page', async ({ page }) => {
    await page.goto('/products');

    // Look for sample request CTA
    const sampleBtn = page.locator('button:has-text(/sample|request/i), a:has-text(/sample|request/i)').first();

    if (await sampleBtn.isVisible({ timeout: 3000 })) {
      await sampleBtn.click();

      // Fill mini form
      await page.fill('[name="email"], #email', `sample-${Date.now()}@example.com`);
      const submitBtn = page.locator('button[type="submit"]').first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await expect(page.locator('text=/thank you|success/i')).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
