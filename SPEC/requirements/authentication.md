# Authentication Requirements

## Overview
Users authenticate via Supabase Auth (email/password + Google OAuth).
Sessions are managed via cookies. Role-based access: `guest`, `client`, `admin`.

## Features

### 1. Sign Up (Email/Password)
- **Route:** `/signup`
- **Method:** POST to Supabase Auth `signUp()`
- **Fields:** firstName, lastName, email, password, confirmPassword, terms agreement
- **Validation:**
  - Password min 8 characters
  - Passwords must match
  - Terms must be agreed
  - Email must be valid format
- **Post-signup:** Redirect to `/login?registered=true`
- **Email confirmation:** Supabase sends confirmation email (handled by Supabase)
- **Acceptance:**
  - [x] Valid signup creates user in Supabase `auth.users`
  - [x] Duplicate email returns error
  - [x] Invalid email format returns error
  - [x] Short password returns error
  - [ ] User metadata stores firstName, lastName, role=client

### 2. Sign In (Email/Password)
- **Route:** `/login`
- **Method:** POST to Supabase Auth `signInWithPassword()`
- **Fields:** email, password, rememberMe
- **Post-login:** Redirect to `/account`
- **Acceptance:**
  - [x] Valid credentials → redirect to `/account`
  - [x] Invalid credentials → error message displayed
  - [ ] Remember me persists session for 30 days
  - [ ] Email confirmation required before login (Supabase setting)

### 3. Sign In (Google OAuth)
- **Route:** `/login` → "Continue with Google"
- **Method:** Supabase Auth `signInWithOAuth({ provider: 'google' })`
- **Redirect:** `/account` after successful OAuth
- **Acceptance:**
  - [x] Google button triggers OAuth flow
  - [ ] New Google user → auto-creates account with role=client
  - [ ] Existing Google user → logs in successfully

### 4. Logout
- **Route:** Any page → "Sign Out" button
- **Method:** Supabase Auth `signOut()`
- **Post-logout:** Redirect to `/`
- **Acceptance:**
  - [x] Logout clears session
  - [x] Redirects to home page

### 5. Session Management
- **Server-side:** `getSession()` server function reads cookie, returns user + role
- **Client-side:** `useAuth()` hook tracks auth state via `onAuthStateChange`
- **Protected routes:**
  - `/account` — requires authentication
  - `/portal` — requires authentication
  - `/admin` — requires authentication + admin role
- **Acceptance:**
  - [x] Unauthenticated user → redirect to `/login`
  - [x] Non-admin user → 403 on `/admin`
  - [x] Server-side session reads cookies correctly

### 6. User Roles
- **Roles:** `client` (default), `admin`
- **Storage:** `user_metadata.role` in Supabase Auth
- **Admin promotion:** `setUserRole()` server function (requires service role key)
- **Acceptance:**
  - [ ] New users default to role=client
  - [ ] Admin can promote/demote users via `/admin`
  - [ ] Role persists across sessions

## Database

No separate users table — uses Supabase `auth.users` with `user_metadata` for role.

## Environment Variables

```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_KEY=<service-role-key>  # For admin operations
```

## Test Coverage

| Test | File | Status |
|------|------|--------|
| Client creation | `src/test/auth.test.ts` | [x] |
| Login with credentials | `src/test/auth.test.ts` | [x] |
| Login error handling | `src/test/auth.test.ts` | [x] |
| E2E signup flow | `test-automation/playwright/tests/auth.spec.ts` | [ ] |
| E2E login flow | `test-automation/playwright/tests/auth.spec.ts` | [ ] |
| E2E Google OAuth | `test-automation/playwright/tests/auth.spec.ts` | [ ] |
