# Testing Requirements

> **Version:** 1.0.0  
> **Last Updated:** 2026-04-27

All features must pass tests before merging. This document defines testing standards.

---

## 🧪 Test Stack

| Type   | Tool       | Purpose                   |
| ------ | ---------- | ------------------------- |
| Unit   | Vitest     | Component & utility tests |
| E2E    | Playwright | Full user flows           |
| Visual | Chromatic  | UI regression             |
| Lint   | ESLint     | Code quality              |
| Type   | TypeScript | Type safety               |

---

## 📁 Test Structure

```
src/
├── components/
│   └── __tests__/
│       ├── Button.test.tsx
│       └── Header.test.tsx
├── hooks/
│   └── __tests__/
│       └── use-mobile.test.ts
├── lib/
│   └── __tests__/
│       └── utils.test.ts
└── routes/
    └── __tests__/
        └── index.test.tsx
```

---

## ✅ Required Tests

### 1. Component Tests

Every new component needs:

- Render test
- Props validation
- Interaction test (if interactive)

```tsx
// Example: Button.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("handles click", async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click me</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalled();
  });
});
```

### 2. Design System Tests

Validate CONSTITUTION.md compliance:

```tsx
// design-tokens.test.ts
import { describe, it, expect } from "vitest";
import { tokens } from "../styles/tokens.css";

describe("Design Tokens", () => {
  it("primary color matches constitution", () => {
    expect(tokens.color.primary).toBe("#8B2635");
  });

  it("font families are correct", () => {
    expect(tokens.font.family.heading).toBe("Playfair Display");
    expect(tokens.font.family.body).toBe("DM Sans");
  });
});
```

### 3. Integration Tests

Test user flows:

```tsx
// navigation.test.ts
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router";

describe("Navigation", () => {
  it("navigates between pages", async () => {
    const router = createMemoryRouter([
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
    ]);

    render(<RouterProvider router={router} />);

    await userEvent.click(screen.getByRole("link", { name: /about/i }));
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
  });
});
```

---

## 🎯 Test Coverage Goals

| Category   | Target |
| ---------- | ------ |
| Components | 80%    |
| Utilities  | 90%    |
| Hooks      | 80%    |
| Routes     | 70%    |

---

## 🚀 Running Tests

```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

---

## 🔒 Pre-commit Hook

Tests run automatically before commit via Husky:

```bash
# This runs on every commit
npm run typecheck && npm run lint && npm run test
```

**Merge blocked if tests fail.**

---

## 📝 Adding New Tests

1. Create `__tests__/` folder next to source file
2. Name files: `{filename}.test.{ext}`
3. Run `npm run test` to verify
4. Add to CI pipeline

---

## 🐛 Debugging Failed Tests

```bash
# Run single test file
npm run test -- src/components/Button.test.tsx

# Run with verbose output
npm run test -- --reporter=verbose

# Update snapshots
npm run test -- --update-snapshots
```

---

_All PRs must pass tests before merge. No exceptions._
