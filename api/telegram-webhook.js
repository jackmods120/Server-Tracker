export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ status: "ok" });
  }

  try {
    const update = req.body || {};
    
    // خوێندنەوەی پەیامی تەلەگرام بۆ دڵنیابوون
    const chatId = update.message?.chat?.id || update.callback_query?.message?.chat?.id;
    const text = update.message?.text;

    console.log(`Received message: ${text} from chat: ${chatId}`);

    // وەڵامی خێرا بە 200 بۆ ئەوەی تەلەگرام سەرکەوتوو بێت
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(200).json({ ok: true });
  }
}
