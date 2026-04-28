# Aura Beauty Hub — Specification Folder

> **Quick Reference for AI Assistants**

This folder contains the complete project constitution and guidelines. **Always consult these files before making changes.**

---

## 📁 Folder Structure

```
SPEC/
├── CONSTITUTION.md      # Design system & rules (MUST READ)
├── FEATURES.md          # Feature registry & proposals
├── RECOMMENDATIONS.md   # Tech stack & architecture guidance
├── TESTING.md           # Test requirements & patterns
├── INFRASTRUCTURE.md    # Docker, deployment, database
└── knowledge-base/      # Chatbot knowledge files
    ├── _index.md
    ├── 01-company.md
    ├── 02-products.md
    ├── 03-ingredients.md
    ├── 04-shipping.md
    ├── 05-returns.md
    ├── 06-wholesale.md
    └── 07-contact.md
```

---

## 🔑 Quick Rules

### Before Any Change
1. Check [CONSTITUTION.md](CONSTITUTION.md) for design rules
2. Check [FEATURES.md](FEATURES.md) to see if feature exists
3. Log new features in [FEATURES.md](FEATURES.md)

### Before Merging
```bash
npm run typecheck  # Must pass
npm run lint       # Must pass
npm run test       # Must pass
```

### Design Rules (from CONSTITUTION.md)
- Primary color: `#8B2635`
- Secondary: `#F5EDE4`
- Accent: `#C9A962`
- Headings: Playfair Display
- Body: DM Sans
- Max container: 1280px

---

## 📋 Feature Status

| Feature | Status |
|---------|--------|
| Home Page | ✅ Live |
| About Page | ✅ Live |
| Products Page | ✅ Live |
| Science Page | ✅ Live |
| Contact Page | ✅ Live |
| Wholesale Page | ✅ Live |
| Ingredients Page | 🔄 Proposed |
| Categories Page | 🔄 Proposed |
| Customer Portal | 🔄 Proposed |
| WhatsApp Integration | 🔄 Proposed |
| AI Chatbot | 🔄 Proposed |

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | TanStack Start + Vite |
| Styling | CSS + Shadcn UI |
| Runtime | Bun |
| Database | Supabase (recommended) |
| Deployment | Vercel + Cloudflare |
| Container | Docker + Docker Compose |

---

## 🚀 Quick Commands

```bash
# Development
bun run dev

# Build
bun run build

# Preview production
bun run preview

# Tests
npm run test

# Lint
npm run lint

# Type check
npm run typecheck

# Docker
docker compose up --build
```

---

*Consult this folder before any significant changes.*