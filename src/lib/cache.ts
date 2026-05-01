/**
 * Client-side in-memory cache utility
 * Uses Map with TTL support for fast, ephemeral caching
 */

type CacheEntry<T> = {
  value: T;
  expires: number;
};

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  set<T>(key: string, value: T, ttlSeconds = 300): void {
    const expires = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expires });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// Singleton instance
export const clientCache = new InMemoryCache();

// React hook for using the cache
import { useState, useEffect } from "react";

export function useCachedState<T>(
  key: string,
  initialValue: T,
  ttlSeconds = 300
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    const cached = clientCache.get<T>(key);
    return cached !== null ? cached : initialValue;
  });

  useEffect(() => {
    clientCache.set(key, state, ttlSeconds);
  }, [key, state, ttlSeconds]);

  const updateState = (value: T | ((prev: T) => T)) => {
    const newValue = typeof value === "function" 
      ? (value as (prev: T) => T)(state)
      : value;
    setState(newValue);
    clientCache.set(key, newValue, ttlSeconds);
  };

  return [state, updateState];
}
