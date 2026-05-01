# Deployment Guide - Vercel

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Prepare Your Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import Project in Vercel
1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose your `full-solution` repository
4. Vercel will auto-detect Vite framework

### Step 3: Configure Environment Variables
In the Vercel setup, add these environment variables (copy from your `.env`):

#### Required Variables (Server-side):
```
SUPABASE_URL=https://kwbpgiidkqyjjafveoxm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...
RESEND_API_KEY=re_9pf3ibQt_GSW6SbKFuEVWH5Tu5Mitjk7t
HUGGINGFACE_API_KEY=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
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-V4-Pro:featherless-ai
REDIS_URL=redis://default:rdRkhnkn6JdDxVhqoUHqW9sOZKq8mreY@redis-19287.c90.us-east-1-3.ec2.cloud.redislabs.com:19287
FROM_EMAIL=noreply@fullsolution.vip
ADMIN_EMAIL=frederick1989@gmail.com
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_URL=postgresql://postgres:Y6FSQTFIXwy6Qz0r@db.kwbpgiidkqyjjafveoxm.supabase.co:5432/postgres
```

#### Variables Exposed to Browser (prefix with VITE_):
```
VITE_APP_URL=https://full-solution-vip-ui.vercel.app
VITE_OAUTH_CALLBACK_URL=https://full-solution-vip-ui.vercel.app/auth/callback
VITE_SUPABASE_OAUTH_CALLBACK_URL=https://kwbpgiidkqyjjafveoxm.supabase.co/auth/v1/callback
VITE_HUGGINGFACE_MODEL=deepseek-ai/DeepSeek-V4-Pro:featherless-ai
VITE_WHATSAPP_NUMBER=27839659614
```

### Step 4: Deploy
Click "Deploy" - Vercel will:
- Install dependencies
- Build the project (`npm run build`)
- Deploy the output

---

## Option 2: Deploy via Vercel CLI (If CLI works)

### Install Vercel CLI
```bash
npm install -g vercel
# or use npx (no installation needed)
```

### Login to Vercel
```bash
npx vercel login
# Follow the prompts to authenticate
```

### Deploy
```bash
# Deploy to production
npx vercel --prod

# Or deploy to preview (staging)
npx vercel
```

---

## Important Notes

### Redis Connection
- **Redis Labs** (REDIS_URL) is confirmed working ✅
- **LangCache** (LANGCACHE_*) is currently NOT reachable ❌
- The app will work without Redis (it falls back to no caching)

### Swagger API Docs
After deployment, access:
```
https://your-project.vercel.app/api-docs
```

### Verify Environment Variables
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Verify all variables are set for "Production" environment

### Custom Domain
To use `fullsolution.vip`:
1. Go to Settings → Domains
2. Add `fullsolution.vip`
3. Update DNS records as instructed
4. Update `VITE_APP_URL` to `https://fullsolution.vip`

---

## Troubleshooting

### "Cannot find module" errors
- Check `package.json` has all dependencies
- Run `npm install` locally before deploying

### Redis connection errors in production
- Redis Labs instance might need IP whitelist
- Check Vercel's deployment logs

### API returns 404
- Verify API routes are in `src/routes/api/` directory
- Check `vercel.json` has correct config

### Build fails
- Run `npm run build` locally to test
- Fix any TypeScript/compilation errors
