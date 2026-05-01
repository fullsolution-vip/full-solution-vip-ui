import { config, parse } from "dotenv";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Load .env file
const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  const parsed = parse(envContent);
  for (const [key, value] of Object.entries(parsed)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
  console.log("✓ Environment loaded from .env");
} else {
  console.error("❌ .env file not found!");
  process.exit(1);
}

// Now import Redis
import Redis from "ioredis";

const LANGCACHE_URL = process.env.LANGCACHE_URL || "";
const LANGCACHE_API_KEY = process.env.LANGCACHE_API_KEY || "";

console.log("\n🏥 Testing Redis/LangCache Connection...");
console.log("LANGCACHE_URL:", LANGCACHE_URL || "(not set)");
console.log("LANGCACHE_API_KEY:", LANGCACHE_API_KEY ? "(set)" : "(not set)");

if (!LANGCACHE_URL) {
  console.error("❌ LANGCACHE_URL not set");
  process.exit(1);
}

// Parse URL
const url = new URL(LANGCACHE_URL);
const host = url.hostname;
const port = parseInt(url.port || "6379");
const password = LANGCACHE_API_KEY || url.password || "";

console.log(`\nConnecting to ${host}:${port}...`);

const redis = new Redis({
  host: host,
  port: port,
  password: password || undefined,
  tls: url.protocol === 'rediss:' ? {} : undefined,
  retryStrategy: (times) => {
    if (times > 2) {
      console.log("❌ Failed to connect after 3 attempts");
      return null;
    }
    return Math.min(times * 100, 3000);
  }
});

redis.on("connect", () => {
  console.log("✓ Redis connected successfully!");
});

redis.on("ready", async () => {
  console.log("✓ Redis ready - running PING test...");
  try {
    const result = await redis.ping();
    console.log("✓ PING successful:", result);
    
    // Test set/get
    const testKey = `test:${Date.now()}`;
    await redis.set(testKey, "hello", "EX", 10);
    const value = await redis.get(testKey);
    console.log("✓ SET/GET test:", value);
    
    await redis.del(testKey);
    console.log("✓ All Redis tests passed!");
    
    redis.quit();
    process.exit(0);
  } catch (err) {
    console.error("❌ Redis operation failed:", err.message);
    redis.disconnect();
    process.exit(1);
  }
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
  redis.disconnect();
  process.exit(1);
});

setTimeout(() => {
  console.error("❌ Connection timeout after 5 seconds");
  redis.disconnect();
  process.exit(1);
}, 5000);
