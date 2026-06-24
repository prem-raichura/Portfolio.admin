import { createClient } from "redis";

const url = process.env.REDIS_URL || "redis://redis:6379";

export const redis = createClient({
  url,
  socket: {
    // A `rediss://` URL (Upstash) auto-enables TLS — no extra flag needed.
    // Bounded reconnect handles idle connections dropped by Upstash.
    keepAlive: true,
    reconnectStrategy: (retries) => Math.min(retries * 100, 2000),
  },
  // Keep the Upstash connection warm so idle serverless instances don't get
  // their TCP socket dropped between requests.
  pingInterval: 10000,
});

redis.on("error", (err) => console.error("Redis Error:", err.message));
redis.on("reconnecting", () => console.warn("Redis reconnecting..."));
redis.on("ready", () => console.log("Redis Connected"));

// Controllers import { redis } and run commands directly, so the connection
// must be open at module load. Guard against a double-connect on warm reuse.
if (!redis.isOpen) {
  await redis.connect();
}
