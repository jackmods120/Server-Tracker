// Run: TELEGRAM_BOT_TOKEN=... TELEGRAM_WEBHOOK_SECRET=... WEBHOOK_URL=https://your-app.vercel.app/api/telegram-webhook node scripts/set-webhook.mjs
const { TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, WEBHOOK_URL } = process.env;
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_WEBHOOK_SECRET || !WEBHOOK_URL) {
  console.error("TELEGRAM_BOT_TOKEN، TELEGRAM_WEBHOOK_SECRET و WEBHOOK_URL پێویستن.");
  process.exit(1);
}
const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ url: WEBHOOK_URL, secret_token: TELEGRAM_WEBHOOK_SECRET, allowed_updates: ["message", "edited_message", "channel_post", "callback_query"] })
});
const data = await response.json();
console.log(data);
if (!data.ok) process.exit(1);