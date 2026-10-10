export default function handler(req, res) {
  return res.status(200).json({
    ok: true,
    configured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_WEBHOOK_SECRET && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
    service: "چاودێری بۆت"
  });
}