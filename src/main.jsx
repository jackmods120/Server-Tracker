import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const fa = (v) => new Intl.DateTimeFormat("ckb-IQ", {
  dateStyle: "medium", timeStyle: "medium", hour12: true
}).format(new Date(v));

function App() {
  const [token, setToken] = useState("");
  const [webhook, setWebhook] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [status, setStatus] = useState("پەیوەندی پشکنین نەکراوە");
  const [busy, setBusy] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("هەموو");
  const [error, setError] = useState("");

  async function loadLogs() {
    try {
      const r = await fetch("/api/logs?limit=60", { cache: "no-store" });
      const d = await r.json();
      if (r.ok) { setLogs(d.logs || []); setError(""); }
      else setError(d.error || "نەتوانرا تۆمارەکان بخوێندرێنەوە.");
    } catch { setError("پەیوەندی بە سێرڤەرەوە نییە."); }
  }
  useEffect(() => {
    loadLogs();
    const id = setInterval(loadLogs, 4000);
    return () => clearInterval(id);
  }, []);

  async function testToken(e) {
    e.preventDefault();
    setBusy(true); setStatus("لە پشکنینی تۆکندا..."); setError("");
    try {
      const r = await fetch("/api/test-token", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "پشکنین سەرکەوتوو نەبوو.");
      setStatus(`بۆت بە سەرکەوتوویی ناسرا: ${d.bot.username ? "@" + d.bot.username : d.bot.first_name}`);
    } catch (e) { setStatus("پشکنین سەرکەوتوو نەبوو"); setError(e.message); }
    finally { setBusy(false); }
  }

  const visibleLogs = logs.filter(x => filter === "هەموو" || x.source === filter);
  return <main className="shell">
    <header className="topbar glass">
      <div className="brandmark">✳</div>
      <div className="brand"><strong>چاودێری بۆت</strong><span>بەڕێوەبردنی Telegram و Webhook</span></div>
      <div className="live"><i /> زیندوو</div>
    </header>

    <section className="hero">
      <p className="eyebrow">ناوەندی چاودێری</p>
      <h1>هەموو ڕووداوەکانت<br/><span>لە یەک شوێن</span></h1>
      <p className="sub">دۆخی بۆتەکەت و ڕووداوەکانی Webhook بە شێوەی ڕاستەقینە چاودێری بکە.</p>
    </section>

    <section className="stats">
      <article className="stat glass"><span>کۆی تۆمارەکان</span><b>{logs.length.toLocaleString("ckb-IQ")}</b><small>لە دواوەی سێرڤەر</small></article>
      <article className="stat glass"><span>Telegram</span><b>{logs.filter(x=>x.source==="Telegram").length.toLocaleString("ckb-IQ")}</b><small>ڕووداوە تۆمارکراوەکان</small></article>
      <article className="stat glass"><span>Vercel</span><b>{logs.filter(x=>x.source==="Vercel").length.toLocaleString("ckb-IQ")}</b><small>داواکارییەکانی Webhook</small></article>
    </section>

    <section className="panel glass">
      <div className="section-title"><div><h2>پەیوەندیی بۆتی Telegram</h2><p>تۆکن لە سێرڤەر هەڵبگرە؛ لەم داشبۆردەدا تەنها پشکنینی دەکەین.</p></div><span className="pill">پارێزراو</span></div>
      <form onSubmit={testToken}>
        <label htmlFor="token">تۆکنی بۆت</label>
        <div className="input-row"><input id="token" type={showToken?"text":"password"} autoComplete="off" value={token} onChange={e=>setToken(e.target.value)} placeholder="تۆکنی بۆتەکەت لێرە دابنێ" required/><button type="button" className="secondary" onClick={()=>setShowToken(!showToken)}>{showToken?"بشارەوە":"پیشاندان"}</button></div>
        <button className="primary" disabled={busy}>{busy?"تکایە چاوەڕێ بکە":"پشکنینی تۆکن"}</button>
      </form>
      <div className="statusline"><span className={status.includes("سەرکەوتوویی")?"dot good":"dot"}></span>{status}</div>
      <div className="note">بۆ بەکارهێنانی بەردەوام، <code>TELEGRAM_BOT_TOKEN</code> لە Vercel → Settings → Environment Variables دابنێ. خانەکە تۆکنەکە لە براوزەر تاقی دەکاتەوە و خۆی هەڵیناگرێت.</div>
    </section>

    <section className="panel glass">
      <div className="section-title"><div><h2>ناونیشانی Webhook</h2><p>ئەمە ناونیشانی API ـی پڕۆژەکەتە لە Vercel.</p></div></div>
      <label htmlFor="webhook">URL ـی Webhook</label>
      <div className="input-row"><input id="webhook" value={webhook} onChange={e=>setWebhook(e.target.value)} placeholder="https://ناوی-پڕۆژەکەت.vercel.app/api/telegram-webhook" dir="ltr"/><button className="secondary" onClick={()=>navigator.clipboard?.writeText(webhook)}>کۆپی</button></div>
      <p className="hint">ئەم خانەیە تەنها بۆ نیشاندان و کۆپییە؛ بۆ ڕێکخستنی Webhook، ڕێنمایی README جێبەجێ بکە.</p>
    </section>

    <section className="panel glass logs-panel">
      <div className="section-title"><div><h2>تۆمارە زیندووەکان</h2><p>نوێکردنەوەی خۆکار هەر ٤ چرکە جارێک.</p></div><span className="live"><i/> Live</span></div>
      <div className="filters">{["هەموو","Telegram","Vercel"].map(x=><button key={x} onClick={()=>setFilter(x)} className={filter===x?"filter active":"filter"}>{x}</button>)}<button className="filter refresh" onClick={loadLogs}>↻ نوێکردنەوە</button></div>
      {error && <div className="error">{error}</div>}
      <div className="log-list">
        {visibleLogs.length===0 ? <div className="empty"><span>⌁</span><b>هێشتا تۆمارێک نییە</b><p>کاتێک Webhook ڕووداوێک وەربگرێت، لێرە دەردەکەوێت.</p></div> :
          visibleLogs.map((log,i)=><article className="log" key={log.id||i}><span className={`log-icon ${log.source==="Telegram"?"tg":""}`}>{log.source==="Telegram"?"➤":"⌘"}</span><div className="log-body"><div className="log-head"><b>{log.title||"ڕووداو"}</b><span className="tag">{log.source}</span></div><p>{log.message||"ڕووداوێک تۆمار کرا."}</p><time>{log.createdAt?fa(log.createdAt):"کاتی نەناسراو"}</time></div></article>)}
      </div>
    </section>
    <footer>دروستکراوە بە شێوازی شوشەیی · کوردیی سۆرانی</footer>
  </main>;
}
createRoot(document.getElementById("root")).render(<App/>);