# Environment Variables - Single Source of Truth

## How It Works

This project uses a **single `.env` file** for all environments (local, test, production).

### Variable Prefixes

| Prefix | Available In | Purpose |
|--------|--------------|---------|
| `VITE_` | Browser + Server | Variables exposed to the UI |
| (no prefix) | Server only | API keys, database URLs, server-side only |

### Examples

```bash
# Server-only (API, tests, build-time)
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
RESEND_API_KEY=...
HUGGINGFACE_API_KEY=...

# Exposed to browser (with VITE_ prefix)
VITE_APP_URL=...
VITE_HUGGINGFACE_MODEL=...
VITE_WHATSAPP_NUMBER=...
```

## Files

| File | Purpose | Gitignored? |
|------|---------|---------------|
| `.env` | Your actual secrets (local dev) | ✅ YES |
| `.env.example` | Template with placeholders | ❌ NO (committed) |
| `ENV_SETUP.md` | This documentation | ❌ NO |

## Local Development

```bash
# 1. Copy example to create your .env
cp .env.example .env

# 2. Edit .env with your actual values
# (This file is gitignored - safe for secrets)

# 3. Start dev server (Vite auto-loads .env)
npm run dev
```

## Running Tests

Tests automatically load `.env` using the setup in `src/test/setup.ts`:

```bash
# Run tests (env vars auto-loaded)
npm test
```

The test setup uses `dotenv` to load `.env` before tests run.

## Deployment to Vercel

### Option 1: Vercel Dashboard (Easiest)

1. Go to your Vercel project → Settings → Environment Variables
2. Add **each variable from your `.env` file**
3. Select environments: ✅ Production ✅ Preview ✅ Development

**Important**: Vercel needs variables **without** `VITE_` prefix to be set in the dashboard too (they're server-only).

### Option 2: Vercel CLI (Sync from local)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Pull env vars from Vercel (to .env.vercel)
vercel env pull .env.vercel

# Or push local .env to Vercel
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
# ... (repeat for each variable)
```

### Option 3: Deploy with Variables

```bash
# Set vars and deploy in one command
vercel --prod \
  -e SUPABASE_URL=@supabase_url \
  -e RESEND_API_KEY=@resend_key
```

## Best Practices

1. **Never commit `.env`** - it's in `.gitignore`
2. **Always update `.env.example`** when adding new vars (with placeholder values)
3. **Use `VITE_` prefix** only for variables the browser needs
4. **Test your `.env.example`** works by copying it to a fresh `.env` and testing
5. **Vercel automatically inherits** dashboard env vars - no need to set in code

## Troubleshooting

### "supabaseUrl is required" error
→ `.env` not loaded. Check:
- File exists at project root
- Variables have no spaces around `=`
- Run `npm test` to verify env loads

### Variables not updating
→ Restart dev server after changing `.env`:
```bash
# Stop server (Ctrl+C) then:
npm run dev
```

### Vercel deployment can't find env vars
→ Check dashboard: Project → Settings → Environment Variables
→ Ensure vars are set for "Production" environment
