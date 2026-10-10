import { Redis } from "@upstash/redis";

export function redisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("UPSTASH_REDIS_REST_URL و UPSTASH_REDIS_REST_TOKEN دابنێ.");
  return new Redis({ url, token });
}

export async function addLog(log) {
  const redis = redisClient();
  const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, createdAt: new Date().toISOString(), ...log };
  await redis.lpush("dashboard:logs", JSON.stringify(entry));
  await redis.ltrim("dashboard:logs", 0, 199);
  return entry;
}