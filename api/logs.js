import { redisClient } from "./_store.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method !== "GET") return res.status(405).json({ error: "تەنها GET ڕێگەپێدراوە." });
  try {
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 50));
    const redis = redisClient();
    const rows = await redis.lrange("dashboard:logs", 0, limit - 1);
    const logs = rows.map(x => typeof x === "string" ? JSON.parse(x) : x);
    return res.status(200).json({ logs });
  } catch (e) {
    return res.status(503).json({ error: "هەڵە لە خوێندنەوەی تۆمارەکان. ڕێکخستنی Redis بپشکنە." });
  }
}