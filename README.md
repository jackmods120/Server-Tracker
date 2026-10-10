# داشبۆردی Telegram + Vercel بە کوردیی سۆرانی

ئەمە پرۆژەیەکی دەستپێکی React/Vite + Vercel Functions ـە. چونکە کۆدی ئەپی ئێستات لە گفتوگۆکەدا بارنەکراوە، ئەمە وەشانی دەستپێکە، نەک دەستکاریی پرۆژەی تایبەتی تۆ.

## پێداویستییەکان
- Node.js 20+
- هەژماری Vercel
- Redis لە Upstash
- بۆتێک لە Telegram BotFather

## ١. دامەزراندن
```bash
npm install
npm run dev
```
بۆ تاقیکردنەوەی API ـەکانی Vercel Functions، باشترە Vercel CLI بەکاربهێنیت:
```bash
npm i -g vercel
vercel dev
```

## ٢. ڕێکخستنی Redis
لە Upstash Redis database دروست بکە و ئەم دوو Environment Variable ـە زیاد بکە لە Vercel:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## ٣. نهێنییەکان لە Vercel
لە Vercel → Project → Settings → Environment Variables ئەمانە دابنێ:
- `TELEGRAM_BOT_TOKEN` — تۆکنی بۆت، تەنها لە سێرڤەر.
- `TELEGRAM_WEBHOOK_SECRET` — نهێنییەکی درێژ و ڕەندۆم، تەنها پیت و ژمارە و `_` و `-` بەکاربهێنە.
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

دوای زیادکردنی Variable ـەکان، پڕۆژەکە دووبارە Deploy بکە.

## ٤. دانانی Webhook
دوای Deploy، URL ـەکەت دەبێت وەک ئەمە بێت:
`https://YOUR-PROJECT.vercel.app/api/telegram-webhook`

لە کۆمپیوتەر یان ترمیناڵدا، بە نهێنییەکانەوە ئەم فەرمانە جێبەجێ بکە؛ تۆکنەکان مەخە ناو کۆد یان Git:
```bash
TELEGRAM_BOT_TOKEN="..." \
TELEGRAM_WEBHOOK_SECRET="..." \
WEBHOOK_URL="https://YOUR-PROJECT.vercel.app/api/telegram-webhook" \
node scripts/set-webhook.mjs
```
ئەنجامی Telegram دەبێت `ok: true` بگەڕێنێتەوە. دواتر پەیامێک بۆ بۆتەکەت بنێرە و لە داشبۆردەکە تۆمارەکە ببینە.

## ٥. چۆنیەتی کارکردن
- `/api/test-token`: تۆکنێک کە بە دەستی لە داشبۆرد نووسراوە پشکنین دەکات، بەڵام هەڵیناگرێت.
- `/api/telegram-webhook`: ڕووداوەکانی Telegram وەردەگرێت و بە نهێنیی Webhook پشتڕاستی دەکاتەوە.
- `/api/logs`: دوا تۆمارەکان لە Redis دەخوێنێتەوە.
- داشبۆردەکە هەر ٤ چرکە جارێک `/api/logs` بانگ دەکات.

## ٦. تۆمارەکانی Vercel
Webhook ـەکە هەر داواکارییەکی پشتڕاستکراو بە سەرچاوەی `Vercel` تۆمار دەکات، و ڕووداوەکەی Telegram ـیش بە جیا تۆمار دەکرێت. ئەمە تۆماری ڕووداوەکانی endpoint ـە، نەک هەموو لۆگی ناوخۆی Vercel Functions. بۆ ڕاکێشانی لۆگی تەواوی پلاتفۆرمی Vercel پێویستە Vercel Logs/Observability API یان Log Drain بە نهێنی و مۆڵەتی API زیاد بکرێت.

## تێبینییە گرنگەکان
- تۆکن لە Frontend هەڵمەگرە؛ خانەی تۆکن تەنها پشکنینی دەکات.
- لۆگەکان لە Upstash Redis هەڵدەگیرێن، نەک لە حافظەی کاتی Function.
- ناوەڕۆکی پەیامەکان دەتوانن زانیاریی تایبەتی تێدا بێت. لە بەرهەمهێناندا باشترە تەنها پێویستترین metadata تۆمار بکرێت.
- ئەم نموونەیە لۆگێکی سادەی چاودێرییە؛ بۆ داشبۆردی بەرهەمهێنان، پاراستنی بەکارهێنەر، rate limiting و ڕێکخستنی دەسەڵات زیاد بکە.
