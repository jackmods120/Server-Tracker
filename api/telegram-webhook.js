import { addLog } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "تەنها POST ڕێگەپێدراوە." });
  }

  try {
    const update = req.body || {};
    
    await addLog({
      source: "Vercel",
      title: "داواکاریی Webhook وەرگیرا",
      message: `Vercel endpoint · جۆری ڕووداو: ${Object.keys(update).join(", ") || "نەناسراو"}`
    });

    const msg = update.message || update.edited_message || update.channel_post || update.callback_query?.message;
    const chatId = msg?.chat?.id;
    const username = msg?.from?.username;
    const text = update.message?.text || update.edited_message?.text || update.channel_post?.text;

    await addLog({
      source: "Telegram",
      title: update.callback_query ? "کلیک لە دوگمە" : "پەیامی نوێ",
      message: [
        username ? `بەکارهێنەر: @${username}` : null,
        chatId ? `ژمارەی چات: ${chatId}` : null,
        text ? `ناوەڕۆک: ${String(text).slice(0, 180)}` : `جۆری ڕووداو: ${Object.keys(update).join(", ") || "نەناسراو"}`
      ].filter(Boolean).join(" · ")
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "تۆمارکردنی ڕووداو سەرکەوتوو نەبوو." });
  }
}
