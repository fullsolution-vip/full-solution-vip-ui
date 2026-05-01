# Deployment Requirements

## Overview
Deploy to Vercel with proper environment configuration and CI/CD.

## Features

### 1. Vercel Configuration
- **Config:** `vercel.json`
- **Build command:** `npm run build`
- **Output:** `dist/` (client) + serverless functions (API routes)
- **Acceptance:**
  - [x] `vercel.json` has correct framework, build, install commands
  - [x] All env vars defined in `vercel.json` with `@env-name` references
  - [ ] `vercel --prod` deploys successfully
  - [ ] Environment variables set in Vercel dashboard

### 2. Environment Variables (Vercel)
Required in Vercel dashboard (or via `vercel env add`):

| Variable | Source | Required |
|----------|--------|----------|
| `SUPABASE_URL` | Supabase project settings | Yes |
| `SUPABASE_ANON_KEY` | Supabase project settings | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase project settings (service role) | Yes |
| `HUGGINGFACE_API_KEY` | Hugging Face settings | Yes (for chatbot) |
| `HUGGINGFACE_API_URL` | Hugging Face model URL | Yes (for chatbot) |
| `REDIS_URL` or `LANGCACHE_URL` | Redis Cloud / Langcache | No (caching) |
| `LANGCACHE_API_KEY` | Langcache dashboard | No (if using Langcache) |

### 3. Supabase Connection (WebSocket?)
- **Note:** The app uses HTTP POST to `/api/chat`, NOT WebSocket
- **Supabase Realtime:** Not currently used (no WebSocket connections)
- **If adding WebSocket later:** Vercel supports WebSockets via Edge Functions, but long-lived connections are better on a dedicated server
- **Current setup:** Stateless HTTP → works fine on Vercel serverless

### 4. HTTPS & Security
- **Vercel:** Automatic HTTPS (free SSL certificate)
- **Supabase:** HTTPS API (no insecure connections)
- **Mixed content:** Ensure all API calls use `https://` (not `http://`)
- **Acceptance:**
  - [ ] Deployed site loads with ✅ HTTPS padlock
  - [ ] No mixed content warnings in console
  - [ ] API calls use HTTPS (check Network tab)

### 5. CI/CD (GitHub Actions)
- **Trigger:** Push to `main` or `develop`
- **Actions:** Test → Build → Deploy to Vercel
- **Acceptance:**
  - [ ] `.github/workflows/deploy.yml` exists
  - [ ] Tests run on every PR
  - [ ] Successful merge to `main` triggers production deploy
  - [ ] Failed tests block deployment

### 6. Post-Deployment Verification
- **Health check:** `https://<domain>/api/health`
- **Chat test:** `POST https://<domain>/api/chat`
- **Auth test:** Sign up → Confirm email → Login
- **Acceptance:**
  - [ ] Health endpoint returns `{"status": "ok"}`
  - [ ] Chat API responds with valid response
  - [ ] Auth flow works end-to-end

## Scripts

| Script | Description |
|--------|-------------|
| `./scripts/deploy-vercel.sh` | Interactive Vercel deployment |
| `vercel --prod` | Deploy to production |
| `vercel env pull .env.production` | Pull env vars from Vercel |

## Test Coverage

| Test | File | Status |
|------|------|--------|
| Vercel build succeeds | CI/CD | [ ] |
| HTTPS enabled | Manual / Playwright | [ ] |
| Health endpoint live | `test-automation/playwright/tests/deployment.spec.ts` | [ ] |
