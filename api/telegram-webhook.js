export default async function handler(req, res) {
  // تەنها داواکاری POST وەردەگرێت
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, message: "Webhook path is active" });
  }

  try {
    // پەیامەکە دەخوێنێتەوە لە تەلەگرامەوە
    const update = req.body || {};
    console.log("Telegram update received:", update);

    // وەڵامی خێرا و ئەرێنی دەداتەوە تەلەگرام تاوەکو هیچ هەڵەیەک ڕوو نەدات
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(200).json({ ok: true });
  }
}
