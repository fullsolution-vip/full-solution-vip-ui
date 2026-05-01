# Full Solution - Deployment & Operations Guide

## Quick Commands

### Start Development
```bash
npm run dev
# App: http://localhost:8080/full-solution-vip-ui/
# Swagger: http://localhost:8080/full-solution-vip-ui/api-docs
```

### Stop/Restart Server
```bash
npm run stop     # Kill all running Node processes
npm run restart  # Stop + restart dev server
```

### Health Check All Services
```bash
npm run health-check
```

Example output:
```
🏥 Full Solution - Health Check
==================================

✓ Found .env file

📊 Testing Supabase Connection...
✓ Supabase connection successful

🔴 Testing Redis/LangCache Connection...
✓ Redis server is reachable at redis-19287.c90.us-east-1-3.ec2.cloud.redislabs.com:19287

🤖 Testing Hugging Face API...
✓ Hugging Face API key is valid

📧 Testing Resend API...
✓ Resend API key is valid
```

### Run Tests
```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
```

---

## Environment Variables - Single Source of Truth

### Local Development
- **One file**: `.env` (gitignored)
- Auto-loaded by Vite + test setup
- See `.env.example` for template

### Production (Vercel)
Set these variables in **Vercel Dashboard** → Project → Settings → Environment Variables:

#### Server-side Only (no VITE_ prefix):
```
SUPABASE_URL=https://kwbpgiidkqyjjafveoxm.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (anon key)
SUPABASE_SERVICE_KEY=eyJhbGc... (service role key)
RESEND_API_KEY=re_9pf3ibQt_GSW6...
FROM_EMAIL=noreply@fullsolution.vip
ADMIN_EMAIL=frederick1989@gmail.com
HUGGINGFACE_API_KEY=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
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-V4-Pro:featherless-ai
REDIS_URL=redis://default:rdRkhnkn6JdDxVhqoUHqW9sOZKq8mreY@redis-19287.c90.us-east-1-3.ec2.cloud.redislabs.com:19287
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://postgres:Y6FSQ...@db.kwbpgiidkqyjjafveoxm.supabase.co:5432/postgres
```

#### Exposed to Browser (VITE_ prefix):
```
VITE_APP_URL=https://full-solution-vip-ui.vercel.app
VITE_OAUTH_CALLBACK_URL=https://full-solution-vip-ui.vercel.app/auth/callback
VITE_SUPABASE_OAUTH_CALLBACK_URL=https://kwbpgiidkqyjjafveoxm.supabase.co/auth/v1/callback
VITE_HUGGINGFACE_MODEL=deepseek-ai/DeepSeek-V4-Pro:featherless-ai
VITE_WHATSAPP_NUMBER=27839659614
```

---

## Deployment to Vercel

### Option 1: Dashboard (Easiest - Recommended)

1. Go to https://vercel.com/new
2. Import your Git repository: `full-solution`
3. Vercel auto-detects Vite framework
4. Add environment variables (see list above)
5. Click **Deploy**

### Option 2: CLI (If working)

```bash
# Login
npx vercel login

# Deploy to production
npx vercel --prod

# Or use the deployment script (may have issues due to Vercel CLI bugs)
# ./scripts/deploy-vercel.sh
```

---

## Features Now Working ✅

### 1. Redis Connection Fixed
- **Redis Labs**: ✅ Working (REDIS_URL)
- **LangCache**: ❌ Not reachable (disabled in .env)
- App gracefully falls back to no caching if Redis unavailable

### 2. Email Service (Resend)
- **Wholesale form**: Now sends email via Resend (not alert popup)
- **Contact form**: Sends email + proper JSON error handling
- **Welcome emails**: Sent on signup

### 3. Google OAuth Fixed
- Added `VITE_OAUTH_CALLBACK_URL` environment variable
- Created `/auth/callback` route
- Updated login/signup pages to use correct callback URL

### 4. Chat Window UI Improved
- Input field auto-focuses at bottom
- Reduced whitespace
- Better mobile responsive design

### 5. API Tests Added
- **34 tests** passing
- Tests for: Supabase, Redis, Resend, Hugging Face, API endpoints
- Run with: `npm test`

### 6. Favicon Added
- Custom SVG favicon with "S" design
- Matches website theme (gold on dark)

### 7. Page Loading Optimized
- Added `preload={true}` to navigation links
- Router configured with `defaultPreload: "intent"`
- Faster page transitions

---

## How to Verify Deployment

### 1. Health Check
```bash
npm run health-check
```
All services should show ✅

### 2. Run Tests
```bash
npm test
```
All 34 tests should pass.

### 3. Access Swagger Docs
```
http://localhost:8080/full-solution-vip-ui/api-docs
```
Test API endpoints interactively.

### 4. Check App
```
http://localhost:8080/full-solution-vip-ui/
```
- Test chat functionality
- Submit contact form (should send email)
- Submit wholesale form (should send email)

---

## Troubleshooting

### Redis Connection Error
- **Cause**: LangCache not reachable
- **Fix**: Use Redis Labs (REDIS_URL is working)
- **Fallback**: App works without Redis (no caching)

### API Returns 404
- **Check**: Server is running (`npm run dev`)
- **Check**: API routes exist in `src/routes/api/`
- **Verify**: Visit `/api-docs` for interactive testing

### Environment Variables Not Loading
- **Local**: Ensure `.env` file exists (copy from `.env.example`)
- **Vercel**: Set variables in dashboard → Settings → Environment Variables
- **Tests**: `src/test/setup.ts` auto-loads `.env`

### Vercel CLI Issues
- **Error**: `Cannot find module '@isaacs/brace-expansion'`
- **Solution**: Use Dashboard deployment (Option 1 above)
- **Alternative**: `npx vercel` (sometimes works)

---

## Session Log

Your requests are logged to `.opencode-session.log`.
- Say **"continue"** to resume after laptop death/restart
- Log shows all requests and fixes applied

---

## Summary

✅ **Redis**: Fixed connection (using Redis Labs)
✅ **Emails**: Wholesale + Contact forms now send via Resend
✅ **OAuth**: Google callback URL properly configured
✅ **Chat UI**: Improved with auto-focus and less whitespace
✅ **Tests**: 34 tests covering all API functionality
✅ **Favicon**: Custom design matching website theme
✅ **Performance**: Preloading added to navigation
✅ **Health Check**: `npm run health-check` tests all services
✅ **Deployment**: Ready for Vercel (dashboard method)
