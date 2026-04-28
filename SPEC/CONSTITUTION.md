# Aura Beauty Hub — Project Constitution

> **Version:** 1.0.0  
> **Last Updated:** 2026-04-27  
> **Status:** Active  

This document is the single source of truth for all design, branding, and UI/UX decisions. Every new feature, page, or component must comply with these rules.

---

## 1. Design System

### 1.1 Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Deep Rose | `#8B2635` | Buttons, links, accents |
| Primary Light | Rose | `#A84A58` | Hover states, secondary accents |
| Primary Dark | Burgundy | `#5C1A22` | Active states, text on light |
| Secondary | Warm Cream | `#F5EDE4` | Backgrounds, cards |
| Secondary Light | Ivory | `#FAF7F2` | Page backgrounds |
| Accent | Gold | `#C9A962` | Icons, highlights, badges |
| Text Primary | Charcoal | `#2D2A26` | Body text, headings |
| Text Secondary | Warm Gray | `#6B6560` | Captions, meta |
| Background | Off-White | `#FDFCFA` | Main background |
| Surface | White | `#FFFFFF` | Cards, modals |
| Border | Light Taupe | `#E5DED6` | Dividers, inputs |
| Success | Sage Green | `#5A7A5A` | Success states |
| Error | Terracotta | `#C45C4A` | Error states |
| Warning | Amber | `#D4A84B` | Warning states |

### 1.2 Typography

| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| H1 | Playfair Display | 700 | 48px / 3rem | 1.2 |
| H2 | Playfair Display | 600 | 36px / 2.25rem | 1.25 |
| H3 | Playfair Display | 600 | 28px / 1.75rem | 1.3 |
| H4 | DM Sans | 600 | 20px / 1.25rem | 1.4 |
| Body | DM Sans | 400 | 16px / 1rem | 1.6 |
| Body Small | DM Sans | 400 | 14px / 0.875rem | 1.5 |
| Caption | DM Sans | 500 | 12px / 0.75rem | 1.4 |
| Button | DM Sans | 600 | 14px / 0.875rem | 1 |
| Nav | DM Sans | 500 | 15px / 0.9375rem | 1 |

**Font Sources:**
- Playfair Display: Google Fonts (https://fonts.google.com/specimen/Playfair+Display)
- DM Sans: Google Fonts (https://fonts.google.com/specimen/DM+Sans)

### 1.3 Spacing System

Base unit: **4px**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing, icon gaps |
| `--space-2` | 8px | Inline element spacing |
| `--space-3` | 12px | Component internal padding |
| `--space-4` | 16px | Default padding |
| `--space-5` | 20px | Section padding |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Section gaps |
| `--space-10` | 40px | Large gaps |
| `--space-12` | 48px | Hero spacing |
| `--space-16` | 64px | Page padding |
| `--space-20` | 80px | Major sections |

### 1.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements, badges |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, modals |
| `--radius-xl` | 16px | Large cards |
| `--radius-full` | 9999px | Pills, avatars |

### 1.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | 0 1px 2px rgba(45, 42, 38, 0.05) | Subtle elevation |
| `--shadow-md` | 0 4px 6px rgba(45, 42, 38, 0.08) | Cards, dropdowns |
| `--shadow-lg` | 0 10px 15px rgba(45, 42, 38, 0.1) | Modals, popovers |
| `--shadow-xl` | 0 20px 25px rgba(45, 42, 38, 0.15) | Hero elements |

### 1.6 Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | 150ms ease | Hover effects |
| `--transition-base` | 200ms ease | Default transitions |
| `--transition-slow` | 300ms ease | Page transitions |
| `--transition-spring` | 500ms cubic-bezier(0.34, 1.56, 0.64, 1) | Animated elements |

---

## 2. Component Rules

### 2.1 Button Variants

| Variant | Background | Text | Border | Hover |
|---------|------------|------|--------|-------|
| Primary | `#8B2635` | `#FFFFFF` | none | `#A84A58` |
| Secondary | transparent | `#8B2635` | `#8B2635` | `#F5EDE4` |
| Ghost | transparent | `#2D2A26` | none | `#F5EDE4` |
| Accent | `#C9A962` | `#2D2A26` | none | `#D4B872` |

**Button Rules:**
- Min height: 44px (touch target)
- Padding: 16px 24px
- Font weight: 600
- Border radius: `--radius-md`
- Never use more than one primary button per section

### 2.2 Card Rules

- Background: `--color-surface`
- Border: 1px solid `--color-border`
- Border radius: `--radius-lg`
- Padding: `--space-6`
- Shadow: `--shadow-sm`
- Hover: translate up 2px + `--shadow-md`

### 2.3 Form Input Rules

- Height: 48px
- Border: 1px solid `--color-border`
- Border radius: `--radius-md`
- Focus: 2px solid `--color-primary`
- Padding: 12px 16px
- Font size: 16px (prevents iOS zoom)

### 2.4 Navigation Rules

- Desktop: horizontal menu with hover underline
- Mobile: slide-in drawer from right
- Sticky header with blur backdrop on scroll
- Logo left, nav center, actions right

---

## 3. Layout Rules

### 3.1 Container

- Max width: 1280px
- Padding: 24px (mobile), 48px (desktop)
- Centered with auto margins

### 3.2 Grid System

- Mobile: 1 column
- Tablet (≥768px): 2 columns
- Desktop (≥1024px): 3-4 columns
- Gap: 24px

### 3.3 Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

---

## 4. Image & Media Rules

### 4.1 Image Optimization

- **Format:** WebP with JPEG fallback
- **Lazy loading:** All images below fold
- **Placeholder:** Blur hash or solid color
- **Sizes:** 320w, 640w, 960w, 1280w, 1920w
- **CDN:** Use Cloudflare Images or similar

### 4.2 Icon Rules

- Use Lucide React icons
- Size: 20px (default), 24px (large), 16px (small)
- Stroke width: 1.5px
- Color: inherit from parent

### 4.3 Video Rules

- Autoplay: muted, no loop
- Poster image required
- Max file size: 10MB
- Use lazy embed patterns

---

## 5. Accessibility Rules

- All interactive elements: keyboard navigable
- Focus indicators: 2px solid primary color
- Color contrast: WCAG AA (4.5:1 for text)
- ARIA labels on icon-only buttons
- Skip to main content link
- Reduced motion support

---

## 6. Performance Rules

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total Bundle Size: < 200KB (initial)
- Image optimization: next-gen formats
- Code splitting: route-based

---

## 7. Enforcement

### 7.1 Pre-commit Checks

Run before every commit:
```bash
npm run lint
npm run typecheck
npm run test
```

### 7.2 Review Checklist

Before merging any PR:
- [ ] Colors match constitution
- [ ] Typography follows rules
- [ ] Spacing uses design tokens
- [ ] Components pass existing tests
- [ ] New components have tests
- [ ] Accessibility audit passes
- [ ] Performance budget met

---

## 8. Exceptions

Any deviation from this constitution requires:
1. Written justification in PR
2. Design lead approval
3. Documentation update
4. Test coverage for exception

---

*This constitution is a living document. Update via PR with design review.*