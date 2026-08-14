import { createClient } from "redis";

// Redis is optional - if REDIS_URL is not set, caching is skipped gracefully
const redisUrl = process.env.REDIS_URL;

let client = null;
let enabled = false;

if (redisUrl) {
  client = createClient({ url: redisUrl });
  client.on("error", (err) => {
    console.warn("⚠️ Redis error (caching disabled):", err.message);
    enabled = false;
  });
  client.on("connect", () => {
    console.log("✅ Redis connected");
    enabled = true;
  });
  client.connect().catch((err) => {
    console.warn("⚠️ Redis connection failed (caching disabled):", err.message);
    enabled = false;
  });
} else {
  console.log("ℹ️ REDIS_URL not set - caching disabled");
}

const DEFAULT_TTL = 300; // 5 minutes in seconds

export async function cacheGet(key) {
  if (!enabled || !client) return null;
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.warn("⚠️ Redis cacheGet failed:", err.message);
    return null;
  }
}

export async function cacheSet(key, value, ttlSeconds = DEFAULT_TTL) {
  if (!enabled || !client) return;
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    console.warn("⚠️ Redis cacheSet failed:", err.message);
  }
}

export async function cacheDelPattern(pattern) {
  if (!enabled || !client) return;
  try {
    // Use SCAN instead of KEYS to avoid blocking the Redis event loop
    const keys = [];
    let cursor = "0";
    do {
      const scanResult = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
      cursor = scanResult.cursor;
      keys.push(...scanResult.keys);
    } while (cursor !== "0");

    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (err) {
    console.warn("⚠️ Redis cacheDelPattern failed:", err.message);
  }
}

export async function cacheDel(key) {
  if (!enabled || !client) return;
  try {
    await client.del(key);
  } catch (err) {
    console.warn("⚠️ Redis cacheDel failed:", err.message);
  }
}

export { enabled as cacheEnabled };