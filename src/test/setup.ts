import "@testing-library/jest-dom";

// Load environment variables BEFORE any imports
// This runs at the top of the file, before other modules are imported
const loadEnv = () => {
  try {
    // Dynamic require to avoid hoisting issues
    const fs = require("fs");
    const path = require("path");
    const { parse } = require("dotenv");
    
    const envPath = path.resolve(process.cwd(), ".env");
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const parsed = parse(envContent);
      
      for (const [key, value] of Object.entries(parsed)) {
        if (!process.env[key]) {
          process.env[key] = value as string;
        }
      }
      console.log("✓ Environment variables loaded from .env");
    } else {
      console.warn("⚠ .env file not found at:", envPath);
    }
  } catch (e) {
    console.warn("Failed to load .env:", e);
  }
};

loadEnv();

// Mock IntersectionObserver for lazy loading tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
} as unknown as typeof IntersectionObserver;

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock window.scroll
Object.defineProperty(window, "scroll", {
  writable: true,
  value: () => {},
});
