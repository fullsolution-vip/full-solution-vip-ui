# Full Solution Web

A premium beauty and skincare e-commerce platform built with TanStack Start, featuring an AI-powered chatbot with RAG (Retrieval-Augmented Generation).

## Live Demo

**Live URL:** https://full-solution-vip-ui.vercel.app

## Features

- **AI Chatbot** - RAG-powered assistant using Hugging Face LLM + Supabase pgvector
- **Authentication** - Supabase Auth with email/password + Google OAuth
- **Observability** - Full logging stack with Grafana, Loki, and OpenTelemetry
- **Modern UI** - TanStack Router, Radix UI, Tailwind CSS v4

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Hugging Face (for chatbot)
HUGGINGFACE_API_KEY=hf_...
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3

# Redis Cache (optional)
LANGCACHE_URL=https://...
LANGCACHE_API_KEY=...
REDIS_URL=redis://...
```

## Database Setup

1. **Enable pgvector in Supabase:**
   ```sql
   create extension if not exists vector;
   ```

2. **Run migration:**
   ```bash
   # Apply the chatbot schema migration
   supabase db push
   # Or manually run: supabase/migrations/001_chatbot_schema.sql
   ```

3. **Verify tables:**
   - `chatbot_sessions` - Chat sessions
   - `chatbot_messages` - User/assistant messages
   - `chatbot_knowledge_base` - Embedded knowledge chunks

## Chatbot & Knowledge Base

The chatbot uses RAG architecture:
- Loads `.md` files from `SPEC/knowledge-base/`
- Generates embeddings via Hugging Face API
- Stores in Supabase with pgvector
- Retrieves relevant context for LLM responses

### Initialize Knowledge Base

```bash
# Process all markdown files (run once, then only processes new/changed files)
npm run dev  # Knowledge base auto-initializes on first request

# Or manually trigger via API:
curl -X POST http://localhost:3000/api/chatbot-init
```

### View Chatbot Logs

```bash
# Real-time logs
tail -f logs/chatbot.log

# Or with observability stack (see below)
```

## Observability Stack

Monitor logs, metrics, and traces with Docker:

```bash
# Start observability stack
docker-compose -f docker-compose.observability.yml up -d

# Access dashboards:
# - Grafana: http://localhost:3000 (no login required)
# - Jaeger Traces: http://localhost:16686
# - Prometheus Metrics: http://localhost:9090
# - Loki: http://localhost:3100
```

### Log Locations

- **File:** `logs/chatbot.log` (auto-created)
- **Console:** All logs output to stdout with timestamps
- **Grafana:** Visualize via Loki data source

### Configuration

Edit configs in `.docker/`:
- `otel-collector-config.yaml` - OpenTelemetry Collector
- `prometheus.yml` - Metrics scraping
- `loki-config.yaml` - Log aggregation
- `promtail-config.yaml` - Log shipping

## Testing

```bash
# Run all tests
npm test

# Run chatbot tests only
npm test -- chatbot.test.ts

# Watch mode
npm run test:watch
```

### Test Coverage

- Chatbot embedding service
- Knowledge base retrieval
- Chat service with RAG
- Text chunking logic

## Authentication (Supabase)

The app uses Supabase Auth:
- Email/password login: `/login`
- Google OAuth: Click "Continue with Google"
- Protected routes: `/account`

### Verify Auth Connection

```bash
# Check if Supabase is reachable
curl http://localhost:3000/api/health  # (if you add this endpoint)

# Or check browser console on /login page for errors
```

## Deployment

### Vercel (Recommended)

```bash
# One-command deployment
./scripts/deploy-vercel.sh

# Or manually:
vercel --prod
```

### GitHub Actions

Pushing to `develop` or `main` triggers automatic deployment via GitHub Actions.

## Project Structure

```
src/
├── components/
│   ├── chatbot/          # Chat UI components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── chatbot/          # RAG services (embeddings, retrieval, chat)
│   └── supabase.ts      # Supabase client
├── routes/
│   ├── api/             # Server API routes
│   └── ...             # TanStack Router pages
└── test/                # Test files
```

## Tech Stack

- **Framework:** TanStack Start (React 19)
- **Routing:** TanStack Router
- **Database:** Supabase (PostgreSQL + pgvector)
- **AI:** Hugging Face Inference API
- **Cache:** Redis (langcache)
- **Styling:** Tailwind CSS v4 + Radix UI
- **Observability:** OpenTelemetry + Grafana + Loki

## Troubleshooting

### Chatbot hangs on "Thinking..."

1. Check logs: `tail -f logs/chatbot.log`
2. Verify Hugging Face API key in `.env`
3. Ensure knowledge base is loaded (check Supabase `chatbot_knowledge_base` table)
4. Test Hugging Face directly: https://huggingface.co/spaces/huggingface/llm-leaderboard

### Login page fails to fetch

1. Check Supabase URL/keys in `.env`
2. Verify Supabase Auth is enabled in dashboard
3. Check browser console for CORS errors
4. Run `npm test -- auth.test.ts` (if available)

### Database connection issues

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'chatbot_%';
```
