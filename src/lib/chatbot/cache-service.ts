import type { Redis } from "ioredis";

const LANGCACHE_URL = process.env.LANGCACHE_URL || "";
const LANGCACHE_API_KEY = process.env.LANGCACHE_API_KEY || "";
const REDIS_URL = process.env.REDIS_URL || "";

export class CacheService {
  private redis: Redis | null = null;
  private useLangcache = false;
  private initialized = false;

  constructor() {
    if (typeof window !== "undefined") return;
    this.init();
  }

  private async init() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const module = await import("ioredis").catch(() => null);
      if (!module) {
        console.warn("ioredis module not available");
        return;
      }

      const RedisClass = module.default || module;
      
      // Try Redis Labs first (it's confirmed working)
      if (REDIS_URL) {
        console.log("🔴 Redis: Connecting to Redis Labs...");
        this.redis = new RedisClass(REDIS_URL);
        this.setupRedisEvents();
        return;
      }
      
      // Try LangCache (if Redis Labs not available)
      if (LANGCACHE_URL) {
        const password = LANGCACHE_API_KEY || "";
        console.log("🔴 Redis: Connecting to LangCache...");
        this.redis = new RedisClass(LANGCACHE_URL, {
          password: password || undefined,
          tls: LANGCACHE_URL.startsWith("rediss://") ? {} : undefined,
        });
        this.useLangcache = true;
        this.setupRedisEvents();
        return;
      }

      console.log("⚠️ Redis: No URL configured - caching disabled");
    } catch (error) {
      console.warn("Redis cache unavailable:", error);
      this.redis = null;
    }
  }

  private setupRedisEvents() {
    if (!this.redis) return;

    this.redis.on("connect", () => {
      console.log("✓ Redis: Connected successfully");
    });

    this.redis.on("error", (err) => {
      console.warn("Redis connection error (non-fatal):", err.message);
    });
  }

  async get(key: string): Promise<string | null> {
    if (!this.redis) return null;
    try {
      return await this.redis.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds = 3600): Promise<void> {
    if (!this.redis) return;
    try {
      await this.redis.setex(key, ttlSeconds, value);
    } catch {
      // Silently fail
    }
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async setJSON<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  generateKey(prefix: string, ...parts: string[]): string {
    return `${prefix}:${parts.join(":")}`;
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}

export const cacheService = new CacheService();
