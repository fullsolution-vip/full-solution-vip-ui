# Playwright Test Automation

End-to-end tests for Full Solution web application using [Playwright](https://playwright.dev).

## Quick Start

```bash
# Install Playwright (first time only)
cd test-automation
npm install
npx playwright install --with-deps

# Run all tests
npm test

# Run with UI (recommended for development)
npm run test:ui

# Run specific test suite
npm run test:auth
npm run test:chat
npm run test:portal
npm run test:admin
npm run test:leads
```

## Test Structure

```
test-automation/
├── playwright.config.ts       # Configuration
├── package.json
└── tests/
    ├── auth.spec.ts          # Signup, login, logout, session
    ├── chatbot.spec.ts       # Chat widget, messaging, history
    ├── portal.spec.ts        # Client portal, chat history
    ├── admin.spec.ts         # Admin panel, user management
    ├── leads.spec.ts         # Lead generation forms
    ├── deployment.spec.ts    # Health checks, HTTPS, API
    └── fixtures/
        └── test-data.ts     # Test users, products, etc.
```

## Writing Tests

Tests should reference `SPEC/requirements/*.md` for acceptance criteria.

### Example Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('User can sign up with email and password', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#email', `test-${Date.now()}@example.com`);
    await page.fill('#password', 'Test123456!');
    await page.fill('#confirmPassword', 'Test123456!');
    await page.check('#terms');

    await page.click('button[type="submit"]');

    // Should redirect to login with success message
    await expect(page).toHaveURL(/\/login.*registered=true/);
  });
});
```

## CI/CD Integration

Tests run automatically on GitHub Actions:

```yaml
- name: Run E2E tests
  run: cd test-automation && npm test
```

## Test Users

Create test users via Supabase dashboard or use the admin API:

| Email | Role | Purpose |
|-------|------|---------|
| test-client@example.com | client | Client portal tests |
| test-admin@example.com | admin | Admin portal tests |

## Debugging

```bash
# Run with browser visible
npm run test:debug

# Run a single test with UI
npx playwright test tests/auth.spec.ts --ui

# View test report
npx playwright show-report
```

## Requirements Reference

Each test file maps to a requirements file:

| Test File | Requirements File |
|-----------|-------------------|
| `auth.spec.ts` | `SPEC/requirements/authentication.md` |
| `chatbot.spec.ts` | `SPEC/requirements/chatbot.md` |
| `portal.spec.ts` | `SPEC/requirements/client-portal.md` |
| `admin.spec.ts` | `SPEC/requirements/admin-portal.md` |
| `leads.spec.ts` | `SPEC/requirements/lead-generation.md` |
| `deployment.spec.ts` | `SPEC/requirements/deployment.md` |
