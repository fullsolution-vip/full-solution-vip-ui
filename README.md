# Full Solution Web

A premium beauty and skincare platform built with TanStack Start, featuring an AI-powered chatbot with RAG (Retrieval-Augmented Generation).

## Live Demo

**Live URL:** https://full-solution-vip-ui.vercel.app

## Features

- **AI Chatbot** - RAG-powered assistant using Hugging Face LLM + Supabase pgvector
- **Authentication** - Supabase Auth with email/password + Google OAuth
- **Client Portal** - Chat history, product queries, account settings
- **Admin Portal** - User management, knowledge base, system health
- **Lead Generation** - Trade applications, sample requests, catalogue downloads
- **Caching** - Redis (Langcache) for fast responses
- **Observability** - Full logging stack with Grafana, Loki, and OpenTelemetry
- **Modern UI** - TanStack Router, Radix UI, Tailwind CSS v4

## Quick Start

```bash
# Install dependencies
npm install

# Create .env from example
cp .env.example .env
# Edit .env with your actual credentials

# Start development server
npm run dev
# App runs at: http://localhost:8080/full-solution-vip-ui/

# Stop all running servers
npm run stop

# Restart development server
npm run restart

# Build for production
npm run build

# Run unit tests
npm test
```

### API Documentation (Swagger)

Access the interactive API documentation at:
```
http://localhost:8080/full-solution-vip-ui/api-docs
```

This provides a full Swagger UI for testing all API endpoints.

## URLs & Routes

### Public Pages
| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/products` | Product catalogue |
| `/science` | Science & lab info |
| `/about` | About us |
| `/wholesale` | Wholesale information |
| `/contact` | Contact page |
| `/login` | Sign in |
| `/signup` | Create account |
| `/chat` | Chat with AI assistant |

### Protected Routes (Authentication Required)
| URL | Description |
|-----|-------------|
| `/account` | User account page |
| `/portal` | Client portal (chat history) |

### Admin Routes (Admin Role Required)
| URL | Description |
|-----|-------------|
| `/admin` | Admin panel (users, knowledge base) |

### API Endpoints
| URL | Method | Description |
|-----|--------|-------------|
| `/api/health` | GET | System health check |
| `/api/chat` | POST | Chat with AI (body: `{ message, sessionId }`) |
| `/api/chatbot-init` | POST | Initialize/re-index knowledge base |
| `/api/admin/users` | GET | List all users (admin only) |

### WebSocket / Real-time
- **Current:** HTTP POST to `/api/chat` (no WebSocket)
- **Future:** WebSocket support planned for streaming responses

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Hugging Face (for chatbot)
HUGGINGFACE_API_KEY=hf_...
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models/...

# Redis Cache (optional)
LANGCACHE_URL=https://...
LANGCACHE_API_KEY=...
REDIS_URL=redis://...
```

**Vercel Deployment:** Set these same variables in Vercel dashboard → Project Settings → Environment Variables.

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
   - `chatbot_sessions` - Chat sessions (linked to `auth.users.id`)
   - `chatbot_messages` - User/assistant messages
   - `chatbot_knowledge_base` - Embedded knowledge chunks

4. **Disable email confirmation (for testing):**
   In Supabase Dashboard → Authentication → Settings → Disable "Confirm email".

## Authentication Flow

- **Signup:** `/signup` → Supabase `signUp()` → Confirm email → Login
- **Login:** `/login` → Supabase `signInWithPassword()` → Redirect to `/account`
- **Google OAuth:** `/login` → Supabase `signInWithOAuth()` → Redirect to `/account`
- **Logout:** Any page → Supabase `signOut()` → Redirect to `/`
- **Roles:** `client` (default), `admin` (set via admin panel)
- **Session:** Managed via cookies, server-side session reading via `getSession()`

## Chatbot & Knowledge Base

The chatbot uses RAG architecture:

- Loads `.md` files from `SPEC/knowledge-base/`
- Generates embeddings via Hugging Face API
- Stores in Supabase with pgvector
- Retrieves relevant context for LLM responses
- Caches responses in Redis for speed

### Initialize Knowledge Base

```bash
# Process all markdown files (run once, then only processes new/changed files)
npm run dev  # Knowledge base auto-initializes on first request

# Or manually trigger via API:
curl -X POST http://localhost:8080/full-solution-vip-ui/api/chatbot-init

# Force re-index all files:
curl -X POST "http://localhost:8080/full-solution-vip-ui/api/chatbot-init?force=true"
```

### View Chatbot Logs

```bash
# Real-time logs
tail -f logs/chatbot.log

# Or with observability stack (see below)
```

## Testing

### Unit Tests (Vitest)

```bash
# Run all tests
npm test

# Run chatbot tests only
npm test -- chatbot.test.ts

# Watch mode
npm run test:watch
```

**Test Coverage (15 tests, all passing):**
- Authentication (mocked Supabase)
- Chatbot embeddings, retrieval, RAG flow
- Text chunking logic
- Supabase connection

### End-to-End Tests (Playwright) - NEW

```bash
# Install Playwright (first time only)
cd test-automation && npm install && npx playwright install --with-deps

# Run all E2E tests
cd test-automation && npm test

# Run with UI (recommended for development)
cd test-automation && npm run test:ui

# Run specific test suite
cd test-automation && npm run test:auth
cd test-automation && npm run test:chat
cd test-automation && npm run test:portal
cd test-automation && npm run test:admin
cd test-automation && npm run test:leads

# Debug mode (browser visible)
cd test-automation && npm run test:debug
```

**E2E Test Coverage:**
- Signup, login, logout flows
- Chat widget functionality
- Client portal (chat history)
- Admin panel (user management)
- Lead generation forms
- Deployment health checks

See [`test-automation/README.md`](test-automation/README.md) for full details.

## Requirements & Specifications

Feature requirements are tracked in [`SPEC/requirements/`](SPEC/requirements/):

| File | Description |
|------|-------------|
| [`authentication.md`](SPEC/requirements/authentication.md) | Signup, login, logout, roles |
| [`chatbot.md`](SPEC/requirements/chatbot.md) | AI chatbot, RAG, knowledge base |
| [`client-portal.md`](SPEC/requirements/client-portal.md) | Client dashboard, chat history |
| [`admin-portal.md`](SPEC/requirements/admin-portal.md) | Admin panel, user management |
| [`lead-generation.md`](SPEC/requirements/lead-generation.md) | Lead capture, forms |
| [`performance.md`](SPEC/requirements/performance.md) | Caching, Core Web Vitals |
| [`deployment.md`](SPEC/requirements/deployment.md) | Vercel, environment config |

Each requirement file lists **acceptance criteria** that E2E tests validate.

## QA Process

Before any commit, the QA Engineer skill validates:

1. **Unit tests pass:** `npm test` (15/15)
2. **E2E tests pass:** `cd test-automation && npm test`
3. **Manual checklist:**
   - [ ] Home page loads at `/`
   - [ ] Signup flow works
   - [ ] Login flow works
   - [ ] Chat sends message, receives AI response
   - [ ] Portal shows chat history
   - [ ] Admin panel accessible with admin role
   - [ ] Health endpoint returns `{"status": "ok"}`
   - [ ] No 500 errors in browser console
   - [ ] HTTPS padlock shows (deployed site)

See [`.opencode/skills/qa-engineer.md`](.opencode/skills/qa-engineer.md) for full QA workflow.

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

## Deployment

### Vercel (Recommended)

```bash
# One-command deployment
./scripts/deploy-vercel.sh

# Or manually:
vercel --prod
```

**Note:** The app uses HTTP (not WebSocket) for chat, so it works perfectly on Vercel's serverless platform. HTTPS is automatic.

### Environment Variables on Vercel

Set these in Vercel dashboard → Project Settings → Environment Variables:

| Variable | Required |
|----------|----------|
| `SUPABASE_URL` | Yes |
| `SUPABASE_ANON_KEY` | Yes |
| `SUPABASE_SERVICE_KEY` | Yes (admin operations) |
| `HUGGINGFACE_API_KEY` | Yes (chatbot) |
| `HUGGINGFACE_API_URL` | Yes (chatbot) |
| `REDIS_URL` or `LANGCACHE_URL` | No (caching) |

### GitHub Actions

Pushing to `develop` or `main` triggers automatic deployment via GitHub Actions.

## Project Structure

```
full-solution/
├── SPEC/
│   ├── knowledge-base/          # Chatbot knowledge markdown files
│   └── requirements/          # Feature requirements (acceptance criteria)
│       ├── authentication.md
│       ├── chatbot.md
│       ├── client-portal.md
│       ├── admin-portal.md
│       ├── lead-generation.md
│       ├── performance.md
│       └── deployment.md
├── src/
│   ├── components/
│   │   ├── chatbot/          # Chat UI components
│   │   ├── ui/             # Reusable UI components
│   │   └── site/           # Header, Footer, etc.
│   ├── lib/
│   │   ├── chatbot/        # RAG services (embeddings, retrieval, chat)
│   │   ├── supabase.ts      # Client-side Supabase
│   │   ├── supabase-server.ts # Server-side Supabase
│   │   ├── auth.ts          # Auth server functions
│   │   └── cache.ts         # Client-side cache
│   ├── routes/
│   │   ├── api/             # Server API routes
│   │   ├── __root.tsx        # Root layout
│   │   ├── index.tsx         # Homepage
│   │   ├── login.tsx         # Login page
│   │   ├── signup.tsx        # Signup page
│   │   ├── account.tsx       # Account page
│   │   ├── portal.tsx        # Client portal
│   │   ├── admin.tsx         # Admin panel
│   │   └── ...              # Other pages
│   └── test/                # Unit tests
├── test-automation/          # Playwright E2E tests
│   ├── playwright.config.ts
│   ├── package.json
│   └── tests/
│       ├── auth.spec.ts
│       ├── chatbot.spec.ts
│       ├── portal.spec.ts
│       ├── admin.spec.ts
│       ├── leads.spec.ts
│       └── deployment.spec.ts
├── .opencode/skills/        # AI agent skills
│   └── qa-engineer.md      # QA workflow
├── supabase/
│   └── migrations/          # Database migrations
├── scripts/                  # Deployment scripts
└── vercel.json              # Vercel configuration
```

## Tech Stack

- **Framework:** TanStack Start (React 19)
- **Routing:** TanStack Router
- **Database:** Supabase (PostgreSQL + pgvector)
- **AI:** Hugging Face Inference API
- **Cache:** Redis (Langcache)
- **Styling:** Tailwind CSS v4 + Radix UI
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Observability:** OpenTelemetry + Grafana + Loki
- **Deployment:** Vercel (serverless)

## Troubleshooting

### Signup/Login fails

1. Check Supabase URL/keys in `.env`
2. Verify Supabase Auth is enabled in dashboard
3. Check if "Confirm email" is enabled (disable for testing)
4. Run `npm test -- auth.test.ts`
5. Check browser console for CORS errors

### Chatbot hangs on "Thinking..."

1. Check logs: `tail -f logs/chatbot.log`
2. Verify Hugging Face API key in `.env`
3. Ensure knowledge base is loaded (check Supabase `chatbot_knowledge_base` table)
4. Test Hugging Face directly: https://huggingface.co/spaces/huggingface/llm-leaderboard

### Database connection issues

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'chatbot_%';
```

### Playwright tests fail

1. Ensure dev server is running: `npm run dev`
2. Check `test-automation/playwright.config.ts` for correct `BASE_URL`
3. Run with UI: `cd test-automation && npm run test:ui`
4. View report: `npx playwright show-report`

### Vercel deployment fails

1. Check `vercel.json` has all required env vars
2. Verify all env vars are set in Vercel dashboard
3. Check build logs: `vercel logs`
4. Test build locally: `npm run build`
