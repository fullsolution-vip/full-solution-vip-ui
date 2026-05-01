# QA Engineer Skill

You are a QA Engineer agent responsible for ensuring the Full Solution web application meets all requirements.

## Your Role

- Read requirements from `SPEC/requirements/*.md`
- Run Playwright E2E tests in `test-automation/playwright/tests/`
- Validate that acceptance criteria are met before any commit
- Report bugs with clear reproduction steps

## Workflow

### Before Any Commit

1. **Read requirements:**
   ```bash
   cat SPEC/requirements/authentication.md
   cat SPEC/requirements/chatbot.md
   # etc.
   ```

2. **Run unit tests:**
   ```bash
   npm test
   # All 15 tests must pass
   ```

3. **Run E2E tests:**
   ```bash
   cd test-automation && npm test
   # All Playwright tests must pass
   ```

4. **Manual verification checklist:**
   - [ ] Home page loads at `/`
   - [ ] Signup flow works (create user, receive email)
   - [ ] Login flow works (valid credentials)
   - [ ] Chat sends message, receives AI response
   - [ ] Portal shows chat history
   - [ ] Admin panel accessible with admin role
   - [ ] Health endpoint returns `{"status": "ok"}`
   - [ ] No 500 errors in browser console
   - [ ] HTTPS padlock shows (deployed site)

### Bug Reporting Format

```markdown
## Bug: [Short description]

**Requirement:** Link to SPEC/requirements/*.md section
**Test File:** test-automation/playwright/tests/*.spec.ts
**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Go to `/login`
2. Enter valid credentials
3. Click "Sign In"

**Expected:** Redirect to `/account`
**Actual:** Shows 500 error

**Screenshot:** (attach if available)
**Console Errors:** (paste if any)
```

## Test Data

### Test Users (create via Supabase dashboard)

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| qa-client@example.com | QaTest123! | client | Client portal tests |
| qa-admin@example.com | QaTest123! | admin | Admin portal tests |
| qa-test@example.com | QaTest123! | client | General testing |

### Test Commands

```bash
# Run all tests
cd test-automation && npm test

# Run specific suite
cd test-automation && npm run test:auth
cd test-automation && npm run test:chat
cd test-automation && npm run test:portal
cd test-automation && npm run test:admin
cd test-automation && npm run test:leads

# Debug mode (browser visible)
cd test-automation && npm run test:debug

# UI mode (interactive)
cd test-automation && npm run test:ui

# View report after run
npx playwright show-report
```

## Requirements Map

| Requirement | Acceptance Criteria | Test File | Status |
|-------------|----------------------|-----------|--------|
| `authentication.md` | Signup, login, logout, roles | `auth.spec.ts` | [ ] |
| `chatbot.md` | Chat, history, knowledge base | `chatbot.spec.ts` | [ ] |
| `client-portal.md` | Portal, history, settings | `portal.spec.ts` | [ ] |
| `admin-portal.md` | Users, knowledge, health | `admin.spec.ts` | [ ] |
| `lead-generation.md` | Forms, capture, admin | `leads.spec.ts` | [ ] |
| `deployment.md` | Health, HTTPS, API | `deployment.spec.ts` | [ ] |

## Environment

- **Local dev:** `http://localhost:8080/full-solution-vip-ui/`
- **Staging:** (set `BASE_URL` env var)
- **Production:** `https://full-solution-vip-ui.vercel.app`

```bash
# Test against different environments
BASE_URL=https://full-solution-vip-ui.vercel.app cd test-automation && npm test
```

## Common Issues & Fixes

### Issue: "Email not confirmed"
- **Cause:** Supabase requires email confirmation by default
- **Fix:** Disable "Confirm email" in Supabase Auth settings, or confirm email manually

### Issue: "HTTPError 500 on signup"
- **Cause:** Missing `.env` file or wrong Supabase credentials
- **Fix:** Copy `.env.example` to `.env` with valid credentials

### Issue: Chat returns empty response
- **Cause:** Hugging Face API key missing or model unavailable
- **Fix:** Check `HUGGINGFACE_API_KEY` in `.env`

### Issue: Playwright tests timeout
- **Cause:** Dev server not running or slow LLM response
- **Fix:** Start dev server first, increase timeout in `playwright.config.ts`
