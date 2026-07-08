// Backend + Telegram bot bir jarayonda. Frontend build (frontend/dist) shu server orqali beriladi.
// Barcha ma'lumotlar backend/data/*.json fayllarda saqlanadi.
// Sayt -> backend -> bot (appointments) va bot -> backend -> sayt (services/videos/certificates/schedule/settings)
// ikkala yo'nalishda ham shu fayl orqali ishlaydi.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Ma'lumotlar papkasini bot util-lari uchun majburiy belgilaymiz.
process.env.DATA_DIR = path.join(__dirname, 'data');

const express = require('express');
const fsNode = require('fs');
const cors = require('cors');
const https = require('https');
const { spawn } = require('child_process');
const { Telegraf } = require('telegraf');

const { createBot } = require('../bot/bot');
const { readJSON } = require('../bot/utils/db');
const { createAppointment } = require('../bot/utils/appointmentService');

const PORT = process.env.PORT || 3001;
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('❌ BOT_TOKEN topilmadi. backend/.env faylini tekshiring (backend/.env.example dan nusxa oling).');
  process.exit(1);
}

const bot = createBot(token);
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// ---------------------------------------------------------------------------
// Xavfsizlik: asosiy HTTP header'lar (helmet o'rniga qo'lda, qo'shimcha
// paket talab qilmasligi uchun)
// ---------------------------------------------------------------------------
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

const allowedOrigins = (process.env.CORS_ORIGIN || '*').split(',').map((o) => o.trim());
app.use(cors({ origin: allowedOrigins.includes('*') ? true : allowedOrigins }));
app.use(express.json({ limit: '1mb' }));

// ---------------------------------------------------------------------------
// Oddiy IP bo'yicha rate-limit (qo'shimcha paketsiz) — faqat yozuv/fayl
// endpointlari uchun, spam/DoS dan asosiy himoya.
// ---------------------------------------------------------------------------
function createRateLimiter({ windowMs, max }) {
  const hits = new Map();
  return (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.start > windowMs) {
      hits.set(key, { start: now, count: 1 });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.start + windowMs - now) / 1000);
      res.setHeader('Retry-After', String(Math.max(retryAfter, 1)));
      return res.status(429).json({ ok: false, error: "So'rovlar juda ko'p. Birozdan so'ng qayta urinib ko'ring." });
    }
    return next();
  };
}

const appointmentLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 5 }); // 1 daqiqada 5 ta so'rov / IP
const fileProxyLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 120 });

// ---------------------------------------------------------------------------
// Frontend build (bir xil origin -> CORS muammosi bo'lmaydi)
// ---------------------------------------------------------------------------
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fsNode.existsSync(frontendDist)) {
  app.use(express.static(frontendDist, { maxAge: '1h', index: false }));
  console.log('📦 Frontend statik fayllar:', frontendDist);
} else {
  console.warn("⚠️  frontend/dist topilmadi. Frontend dev server alohida ishga tushadi yoki `npm run build:frontend` bajaring.");
}

// Har bir API so'rovini oddiy log qilish (debug uchun qulay)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (req.path.startsWith('/api/')) {
      console.log(`${req.method} ${req.path} -> ${res.statusCode} (${Date.now() - start}ms)`);
    }
  });
  next();
});

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// ---------------------------------------------------------------------------
// Faqat o'qish uchun API — bot orqali qo'shilgan ma'lumotlar saytda ko'rinadi
// (Bot -> backend/data/*.json -> Sayt yo'nalishi)
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.get('/api/services', (req, res) => res.json(readJSON('services.json', [])));
app.get('/api/videos', (req, res) => res.json(readJSON('videos.json', [])));
app.get('/api/certificates', (req, res) => res.json(readJSON('certificates.json', [])));
app.get('/api/schedule', (req, res) => res.json(readJSON('schedule.json', {})));
app.get('/api/settings', (req, res) => res.json(readJSON('settings.json', {})));

// ---------------------------------------------------------------------------
// Telegram fayl proksi — bot orqali yuklangan rasm/video Telegram serverida
// saqlanadi (backend/data/*.json da faqat file_id bor). Sayt to'g'ridan-to'g'ri
// Telegramga kira olmagani va bot tokenini oshkor qilmaslik uchun backend
// orqali oqim (stream) qilib beriladi: GET /api/file/:fileId
// ---------------------------------------------------------------------------
app.get('/api/file/:fileId', fileProxyLimiter, asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  if (!fileId || fileId.length > 200) {
    return res.status(400).json({ ok: false, error: "Noto'g'ri fayl identifikatori." });
  }
  let link;
  try {
    link = await bot.telegram.getFileLink(fileId);
  } catch (err) {
    console.error('[GET /api/file]', err.message);
    return res.status(404).json({ ok: false, error: 'Fayl topilmadi.' });
  }

  https.get(link.href, (tgRes) => {
    if (tgRes.statusCode && tgRes.statusCode >= 400) {
      res.status(502).json({ ok: false, error: 'Faylni olishda xatolik.' });
      tgRes.resume();
      return;
    }
    res.setHeader('Cache-Control', 'public, max-age=86400');
    if (tgRes.headers['content-type']) res.setHeader('Content-Type', tgRes.headers['content-type']);
    if (tgRes.headers['content-length']) res.setHeader('Content-Length', tgRes.headers['content-length']);
    tgRes.pipe(res);
  }).on('error', (err) => {
    console.error('[GET /api/file] stream error:', err.message);
    if (!res.headersSent) res.status(502).json({ ok: false, error: 'Faylni olishda xatolik.' });
  });
}));

// ---------------------------------------------------------------------------
// Yozish uchun API — sayt orqali yuborilgan ma'lumot botga/adminlarga boradi
// (Sayt -> backend -> Bot yo'nalishi)
// ---------------------------------------------------------------------------
app.post('/api/appointments', appointmentLimiter, asyncHandler(async (req, res) => {
  const { name, phone, date, time, note } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) {
    return res.status(400).json({ ok: false, error: 'Ism kiritilishi shart (2-120 belgi).' });
  }
  const phoneDigits = String(phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    return res.status(400).json({ ok: false, error: "Telefon raqami noto'g'ri." });
  }
  if (note && String(note).length > 500) {
    return res.status(400).json({ ok: false, error: 'Izoh juda uzun (maksimal 500 belgi).' });
  }

  const appointment = await createAppointment(bot.telegram, {
    name: String(name).trim(),
    phone: String(phone).trim(),
    date: date ? String(date).trim().slice(0, 40) : '',
    time: time ? String(time).trim().slice(0, 20) : '',
    note: note ? String(note).trim().slice(0, 500) : '',
    source: 'site',
  });
  res.json({ ok: true, appointment });
}));

// SPA fallback (API bo'lmagan barcha marshrutlarda index.html qaytariladi)
app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ ok: false, error: 'Topilmadi' });
  const indexPath = path.join(frontendDist, 'index.html');
  if (fsNode.existsSync(indexPath)) return res.sendFile(indexPath);
  res.status(404).send("Frontend build topilmadi. `npm run build --prefix ../frontend` bajaring yoki dev rejimda ishlating.");
});

// Markazlashtirilgan xato ushlagich
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[server] Kutilmagan xatolik:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ ok: false, error: "Server xatoligi. Birozdan so'ng qayta urinib ko'ring." });
});

// ---------------------------------------------------------------------------
// Frontend dev server (agar START_FRONTEND=1 bo'lsa)
// ---------------------------------------------------------------------------
let frontendProc = null;
if (process.env.START_FRONTEND === '1') {
  const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  frontendProc = spawn(cmd, ['run', 'dev'], {
    cwd: path.join(__dirname, '..', 'frontend'),
    stdio: 'inherit',
    env: process.env,
  });
  console.log("🚀 Frontend dev server ishga tushmoqda...");
  frontendProc.on('exit', (code) => {
    if (code && code !== 0) console.error(`⚠️  Frontend dev server ${code} kod bilan to'xtadi.`);
  });
}

// ---------------------------------------------------------------------------
// Ishga tushirish — bot vaqtincha ishga tushmasa ham sayt/API ishlashda
// davom etadi (bir necha marta qayta urinadi, chunki tarmoq vaqtincha
// uzilishi mumkin).
// ---------------------------------------------------------------------------
async function launchBotWithRetry(retries = 3, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // bot.launch() polling to'xtamaguncha resolve bo'lmaydi, shuning uchun
      // fon jarayoni sifatida ishga tushiramiz va xatolikni alohida ushlaymiz.
      bot.launch().catch((err) => {
        console.error('❌ Telegram bot ishlash jarayonida xatolik:', err.message);
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('🤖 Telegram bot ishga tushdi.');
      return true;
    } catch (err) {
      console.error(`❌ Bot ishga tushmadi (${attempt}/${retries}):`, err.message);
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  console.error('❌ Telegram bot ishga tushmadi. Faqat sayt/API ishlaydi (BOT_TOKEN va internetni tekshiring).');
  return false;
}

async function start() {
  await launchBotWithRetry();
  app.listen(PORT, () => {
    console.log(`✅ Backend: http://localhost:${PORT}`);
    console.log(`📁 Ma'lumotlar papkasi: ${process.env.DATA_DIR}`);
  });
}
start();

function shutdown(sig) {
  console.log(`\n🛑 ${sig} qabul qilindi, to'xtatilmoqda...`);
  try { bot.stop(sig); } catch (_) { /* noop */ }
  if (frontendProc) frontendProc.kill();
  process.exit(0);
}
process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});
