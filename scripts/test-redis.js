const Redis = require("ioredis");

// Test LangCache connection
const LANGCACHE_URL = process.env.LANGCACHE_URL || "";
const LANGCACHE_API_KEY = process.env.LANGCACHE_API_KEY || "";

console.log("Testing Redis/LangCache connection...");
console.log("LANGCACHE_URL:", LANGCACHE_URL || "(not set)");
console.log("LANGCACHE_API_KEY:", LANGCACHE_API_KEY ? "(set)" : "(not set)");

if (!LANGCACHE_URL) {
  console.log("❌ No LANGCACHE_URL set");
  process.exit(1);
}

// Parse URL
const url = new URL(LANGCACHE_URL);
const host = url.hostname;
const port = url.port || 6379;
const password = LANGCACHE_API_KEY || url.password;

console.log(`Connecting to ${host}:${port}...`);

const redis = new Redis({
  host: host,
  port: parseInt(port),
  password: password || undefined,
  tls: url.protocol === 'rediss:' ? {} : undefined,
  retryStrategy: (times) => {
    console.log(`Retry attempt ${times}`);
    if (times > 3) {
      console.log("❌ Failed to connect after 3 attempts");
      return null; // Stop retrying
    }
    return Math.min(times * 100, 3000);
  }
});

redis.on("connect", () => {
  console.log("✓ Redis connected successfully!");
  redis.quit();
  process.exit(0);
});

redis.on("error", (err) => {
  console.log("❌ Redis connection error:", err.message);
  redis.disconnect();
  process.exit(1);
});

// Simple ping test
redis.ping().then(() => {
  console.log("✓ PING successful");
  redis.quit();
  process.exit(0);
}).catch((err) => {
  console.log("❌ PING failed:", err.message);
  process.exit(1);
});

setTimeout(() => {
  console.log("❌ Connection timeout after 5 seconds");
  redis.disconnect();
  process.exit(1);
}, 5000);
