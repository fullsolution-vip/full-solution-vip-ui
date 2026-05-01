# Performance & Caching Requirements

## Overview
Ensure the site is fast, responsive, and uses caching effectively to reduce costs and improve UX.

## Features

### 1. Client-Side Caching
- **Mechanism:** `lib/cache.ts` — InMemoryCache with TTL
- **Hook:** `useCachedState(key, initialValue, ttlSeconds)`
- **Use cases:** Product lists, category data, static content
- **Acceptance:**
  - [x] Cache supports TTL-based expiration
  - [x] Cache cleanup runs every 5 minutes
  - [ ] Static pages cached for 5 minutes
  - [ ] Product data cached per category

### 2. Server-Side Caching (Redis/Langcache)
- **Mechanism:** `lib/chatbot/cache-service.ts` — Redis client
- **Response cache:** `response:{sessionId}:{messageHash}` TTL 1800s
- **Message cache:** `messages:{sessionId}` TTL 300s
- **Acceptance:**
  - [x] Redis connects if REDIS_URL or LANGCACHE_URL set
  - [x] Chat responses cached and returned on hit
  - [x] Cache logged in `logs/chatbot.log`
  - [ ] Cache stats visible in admin panel
  - [ ] Cache invalidation on knowledge base update

### 3. Core Web Vitals
- **Target LCP:** < 2.5s (mobile), < 1.8s (desktop)
- **Target INP:** < 200ms
- **Target CLS:** < 0.1
- **Acceptance:**
  - [ ] LCP measured via Vercel Analytics / Web Vitals
  - [ ] Images optimized (WebP, AVIF, responsive)
  - [ ] Fonts preloaded (currently Google Fonts loaded sync)
  - [ ] Hero image `priority` flag set
  - [ ] Code splitting for routes (TanStack lazy)

### 4. Observability
- **Stack:** OpenTelemetry → Grafana + Loki + Prometheus
- **Logs:** `logs/chatbot.log` (file) + Loki (Docker)
- **Dashboards:** Grafana at `http://localhost:3000`
- **Acceptance:**
  - [x] Chatbot logs to file with timestamps
  - [x] Docker observability stack available
  - [ ] Vercel deployment sends logs to external provider
  - [ ] Real-time error alerting (Sentry or similar)

### 5. SEO Optimization
- **Meta tags:** Per-page via TanStack Router `head()`
- **Schema markup:** Product, Organization, Article (Blog)
- **Sitemap:** `sitemap.xml` generation
- **Acceptance:**
  - [x] Each route has unique title + description
  - [x] Open Graph tags set
  - [ ] Schema.org JSON-LD on product pages
  - [ ] `sitemap.xml` and `robots.txt`
  - [ ] Google Analytics / Tag Manager integration

## Environment Variables

```
# Redis
REDIS_URL=redis://...
LANGCACHE_URL=https://...
LANGCACHE_API_KEY=...

# Observability
OTEL_EXPORTER_OTLP_ENDPOINT=...
GRAFANA_API_KEY=...
```

## Test Coverage

| Test | File | Status |
|------|------|--------|
| Cache set/get | `src/test/chatbot.test.ts` | [x] |
| Cache TTL expiration | `src/test/chatbot.test.ts` | [ ] |
| Web Vitals measurement | `test-automation/playwright/tests/performance.spec.ts` | [ ] |
| Lighthouse CI | GitHub Actions | [ ] |
