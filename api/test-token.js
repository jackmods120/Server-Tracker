export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "تەنها داواکاریی POST ڕێگەپێدراوە." });
  try {
    const { token } = req.body || {};
    if (typeof token !== "string" || !/^\d+:[A-Za-z0-9_-]{20,}$/.test(token)) {
      return res.status(400).json({ error: "شێوازی تۆکنی Telegram دروست نییە." });
    }
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();
    if (!response.ok || !data.ok) return res.status(401).json({ error: "تۆکنەکە ڕاست نییە یان Telegram ڕەتیکردووەتەوە." });
    return res.status(200).json({ bot: data.result });
  } catch {
    return res.status(502).json({ error: "پەیوەندی بە Telegram سەرکەوتوو نەبوو." });
  }
}