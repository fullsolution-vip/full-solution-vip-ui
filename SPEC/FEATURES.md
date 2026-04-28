# Aura Beauty Hub — Feature Registry

> **Version:** 1.0.0  
> **Last Updated:** 2026-04-27  

This document tracks all existing features and serves as the template for proposing new ones.

---

## 📋 Existing Features

### Core Pages

| Feature | Status | Route | Owner | Notes |
|---------|--------|-------|-------|-------|
| Home Page | ✅ Live | `/` | System | Hero, marquee, featured products |
| About Page | ✅ Live | `/about` | System | Brand story, team |
| Products Page | ✅ Live | `/products` | System | Product catalog |
| Science Page | ✅ Live | `/science` | System | Research & ingredients |
| Contact Page | ✅ Live | `/contact` | System | Contact form |
| Wholesale Page | ✅ Live | `/wholesale` | System | B2B inquiries |

### Core Components

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| Header | ✅ Live | `components/site/Header.tsx` | Sticky, responsive |
| Footer | ✅ Live | `components/site/Footer.tsx` | Links, social |
| Marquee | ✅ Live | `components/site/Marquee.tsx` | Brand ticker |

### UI Components (Shadcn)

All components in `components/ui/` follow design system.

---

## 🚀 Feature Proposal Template

Use this template when proposing new features:

```markdown
## Feature: [Feature Name]

### Description
Brief description of what this feature does.

### User Story
As a [user type], I want [goal] so that [benefit].

### Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

### Design References
- Figma link or screenshot
- Related constitution rules

### Technical Notes
- API endpoints needed
- Database changes
- Third-party services

### Priority
- [ ] Critical (P0)
- [ ] High (P1)
- [ ] Medium (P2)
- [ ] Low (P3)

### Status
- [ ] Proposed
- [ ] In Review
- [ ] In Development
- [ ] Testing
- [ ] Deployed

### Timeline
- Proposed: YYYY-MM-DD
- Target: YYYY-MM-DD
```

---

## 📝 New Feature Proposals

### Feature: Ingredients Page

**Status:** Proposed  
**Priority:** High (P1)  
**Proposed:** 2026-04-27

#### Description
A dedicated page showcasing product ingredients with detailed information, similar to careco.co.za/ingredients/.

#### Requirements
- [ ] Ingredient listing with search/filter
- [ ] Individual ingredient detail pages
- [ ] Scientific information display
- [ ] Safety and usage guidelines
- [ ] Related products per ingredient

#### Design References
- Reference: https://www.careco.co.za/ingredients/
- Must follow CONSTITUTION.md color palette
- Use existing card components

#### Technical Notes
- New route: `/ingredients`
- Content managed via CMS or static MD
- Consider dynamic import for large lists

---

### Feature: Categories Page

**Status:** Proposed  
**Priority:** High (P1)  
**Proposed:** 2026-04-27

#### Description
Product category browsing page similar to careco.co.za/categories/.

#### Requirements
- [ ] Category grid display
- [ ] Category filtering
- [ ] Product count per category
- [ ] Featured category hero
- [ ] SEO-optimized category pages

#### Design References
- Reference: https://www.careco.co.za/categories/
- Match existing product page style

#### Technical Notes
- Route: `/categories` or `/products/categories`
- Integrate with product data

---

### Feature: Customer Portal

**Status:** Proposed  
**Priority:** Medium (P2)  
**Proposed:** 2026-04-27

#### Description
Authenticated portal for clients to manage their orders and product preferences.

#### Requirements
- [ ] User authentication (login/register)
- [ ] Order history and tracking
- [ ] Saved products/wishlist
- [ ] Account settings
- [ ] Wholesale pricing access (if B2B)

#### Technical Notes
- Requires backend API
- Database for user data
- Authentication via JWT or session

---

### Feature: WhatsApp Integration

**Status:** Proposed  
**Priority:** Medium (P2)  
**Proposed:** 2026-04-27

#### Description
Quick WhatsApp contact option for customers.

#### Requirements
- [ ] Floating WhatsApp button
- [ ] Pre-filled message template
- [ ] Click-to-chat link
- [ ] Mobile-optimized

#### Technical Notes
- Use WhatsApp Business API or direct link
- No backend required

---

### Feature: AI Chatbot

**Status:** Proposed  
**Priority:** Medium (P2)  
**Proposed:** 2026-04-27

#### Description
Customer service chatbot answering basic questions.

#### Requirements
- [ ] Chat widget on site
- [ ] FAQ matching
- [ ] Knowledge base integration
- [ ] Fallback to human support
- [ ] HuggingsFace model integration

#### Technical Notes
- Use local LLM or API
- Knowledge base in `/SPEC/knowledge-base/`
- Consider RAG implementation

---

## 🔄 Feature Roadmap

| Quarter | Focus | Features |
|---------|-------|----------|
| Q2 2026 | Content Pages | Ingredients, Categories |
| Q3 2026 | Customer Features | Portal, Auth |
| Q4 2026 | Communication | WhatsApp, Chatbot |

---

## 📊 Feature Metrics

Track feature performance here:

| Feature | Launch Date | Views | Conversions | Issues |
|---------|-------------|-------|-------------|--------|
| - | - | - | - | - |

---

*Update this file when adding new features. All features must pass tests before merge.*