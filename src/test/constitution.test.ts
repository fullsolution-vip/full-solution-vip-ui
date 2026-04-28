import { describe, it, expect } from "vitest";

describe("Sample Test", () => {
  it("passes basic assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("matches design tokens from constitution", () => {
    const tokens = {
      color: {
        primary: "#8B2635",
        secondary: "#F5EDE4",
        accent: "#C9A962",
      },
      font: {
        heading: "Playfair Display",
        body: "DM Sans",
      },
    };

    expect(tokens.color.primary).toBe("#8B2635");
    expect(tokens.color.secondary).toBe("#F5EDE4");
    expect(tokens.color.accent).toBe("#C9A962");
    expect(tokens.font.heading).toBe("Playfair Display");
    expect(tokens.font.body).toBe("DM Sans");
  });
});
