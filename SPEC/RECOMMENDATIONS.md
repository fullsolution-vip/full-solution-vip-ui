# AI Assistant Recommendations

> **Version:** 1.0.0  
> **Last Updated:** 2026-04-27

This document provides AI assistants with guidance on recommended technologies, patterns, and enhancements for Aura Beauty Hub.

---

## 🛠 Technology Stack Recommendations

### Current Stack (Frontend)

- **Framework:** TanStack Start (React)
- **Styling:** CSS Modules + Shadcn UI
- **Build Tool:** Vite
- **Runtime:** Bun

### Recommended Backend Options

| Option                | Pros                                  | Cons                   | Recommendation                |
| --------------------- | ------------------------------------- | ---------------------- | ----------------------------- |
| **Supabase**          | Free tier, PostgreSQL, Auth, Realtime | Limited to 2GB on free | ✅ Recommended                |
| **Firebase**          | Generous free tier, Easy auth         | Vendor lock-in         | Consider for quick MVP        |
| **Cloudflare D1**     | Free tier, Edge ready                 | Limited queries        | ✅ Good for Vercel/Cloudflare |
| **Neon (PostgreSQL)** | Generous free, Branching              | Cold starts            | Good alternative              |

**Recommendation:** Start with **Supabase** — excellent free tier, PostgreSQL (relational data fits e-commerce), built-in auth, and easy API generation.

---

## 📁 Project Structure Recommendations

### Current Structure

```
src/
├── components/
├── hooks/
├── lib/
├── routes/
```

### Recommended Enhanced Structure

```
src/
├── components/
│   ├── site/          # Page-specific components
│   ├── ui/            # Reusable UI components
│   └── features/      # Feature-specific components
├── hooks/             # Custom React hooks
├── lib/               # Utilities
├── routes/            # TanStack Start routes
├── services/          # API service layer
├── types/             # TypeScript definitions
├── contexts/          # React contexts
└── data/              # Static data, JSON
```

**Why:** Separates feature components from generic UI, makes scaling easier.

---

## 🚀 Performance Recommendations

### Image Optimization Strategy

1. **Use `@unpic/react`** — Modern image component with automatic srcset
2. **Implement blur placeholders** — Show while loading
3. **Use Cloudflare Images or Vercel Blob** — CDN delivery
4. **Lazy load below-fold images** — Native lazy loading

```tsx
// Recommended pattern
import { Image } from "@unpic/react";

<Image
  src={product.image}
  layout="constrained"
  widths={[320, 640, 960]}
  sizes="(max-width: 768px) 100vw, 50vw"
  alt={product.name}
/>;
```

### Code Splitting

- Route-based splitting (TanStack Start does this)
- Component lazy loading for heavy features:

```tsx
const HeavyComponent = lazy(() => import("./HeavyComponent"));
```

### Caching Strategy

| Resource      | Cache Strategy         | TTL    |
| ------------- | ---------------------- | ------ |
| Static assets | Cache-first            | 1 year |
| API responses | Stale-while-revalidate | 5 min  |
| HTML          | Network-first          | 0      |

---

## 🔌 API & Backend Architecture

### Recommended API Structure

```
/api
├── /auth              # Authentication endpoints
│   ├── POST /register
│   ├── POST /login
│   └── POST /logout
├── /products          # Product CRUD
│   ├── GET /
│   ├── GET /:id
│   └── POST / (admin)
├── /orders            # Order management
│   ├── GET / (auth)
│   └── POST / (auth)
├── /ingredients       # Ingredient data
│   └── GET /
└── /chat              # Chatbot API
    └── POST /
```

### Database Schema (Supabase)

```sql
-- Users (extends Supabase auth)
profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP
)

-- Products
products (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  price DECIMAL,
  category_id UUID,
  image_url TEXT,
  ingredients JSONB,
  created_at TIMESTAMP
)

-- Orders
orders (
  id UUID PRIMARY KEY,
  user_id UUID,
  status TEXT,
  total DECIMAL,
  created_at TIMESTAMP
)
```

---

## 🐳 Docker & Deployment

### Docker Setup

Create `Dockerfile`:

```dockerfile
FROM oven/bun:1-alpine

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]
```

### Docker Compose (Full Stack)

```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - API_URL=${API_URL}

  # Future: Add API service
  # api:
  #   build: ./api
  #   ports:
  #     - "4000:4000"

  # Future: Add Redis for caching
  # redis:
  #   image: redis:alpine
```

### Deployment Targets

| Platform             | Status         | Notes              |
| -------------------- | -------------- | ------------------ |
| **Vercel**           | ✅ Configured  | Primary deployment |
| **Cloudflare Pages** | ⚠️ Needs setup | Edge deployment    |
| **Railway**          | 🔄 Optional    | Backend hosting    |

---

## 🎨 UI/UX Recommendations

### Component Library Extensions

Consider adding:

- **Data table** — For admin panels
- **Date picker** — For scheduling
- **File upload** — For product images
- **Rich text editor** — For CMS content

### Animation Guidelines

- Use Framer Motion for complex animations
- Keep animations under 300ms
- Support `prefers-reduced-motion`
- Animate only: opacity, transform, scale

---

## 🔒 Security Recommendations

### API Security

- Rate limiting: 100 req/min per IP
- CORS: Specific origins only
- JWT expiry: 15 min access, 7 day refresh
- Sanitize all inputs

### Environment Variables Required

```
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
JWT_SECRET=
OPENAI_API_KEY=  # For chatbot
```

---

## 📋 Quick Reference for AI

### Before Adding New Feature

1. **Check CONSTITUTION.md** — Follow design rules
2. **Check FEATURES.md** — Log the feature
3. **Check this file** — Review recommendations
4. **Run tests** — Ensure nothing breaks
5. **Typecheck** — No TS errors
6. **Lint** — No lint errors

### Code Quality Gates

```bash
npm run typecheck  # Must pass
npm run lint       # Must pass
npm run test       # Must pass
```

---

_AI assistants should consult this file before proposing architectural changes._
