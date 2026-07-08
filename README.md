# Bekzod Abdiyev — Full Stack

Papka tuzilishi:

```
bekzod-abdiyev/
├── frontend/   # Vue 3 sayt (Vite)
├── bot/        # Telegram bot (Telegraf) — kutubxona + standalone entry
└── backend/    # Express API + Telegram bot ishga tushiruvchi + frontend static server
    └── data/   # Hamma ma'lumotlar JSON fayllarda (services, videos, certificates, appointments, ...)
```

Frontend saytdan yuborilgan malumotlar backendga -> u yerdan botga; bot orqali qo'shilgan xizmat / natija / sertifikat backend/data/*.json faylida saqlanadi va sayt shu API dan o'qiydi.

## 1. Sozlash

```bash
cd bekzod-abdiyev
cp backend/.env.example backend/.env   # BOT_TOKEN va ADMIN_IDS ni to'ldiring
npm run install:all
```

## 2. Ishga tushirish (production - bitta jarayon)

Backend ishga tushsa **bot ham, frontend ham avtomatik** ishlaydi:

```bash
npm start
```

Bu quyidagilarni bajaradi:
1. `frontend/` ni build qiladi (`frontend/dist`)
2. `backend/server.js` ni ishga tushiradi:
   - Telegram bot ishga tushadi
   - Express API `http://localhost:3001` da javob beradi
   - `frontend/dist` shu port orqali sayt sifatida beriladi (`http://localhost:3001`)

## 3. Ishga tushirish (dev rejim - hot reload)

```bash
npm run dev
```

- Backend: `http://localhost:3001`
- Frontend dev: `http://localhost:5173` (API `/api/*` proxy orqali backendga uzatiladi)
- Bot avtomatik ishlaydi

## 4. Faqat botni ishga tushirish

```bash
npm run bot
```

## 5. Ma'lumotlar

Hamma ma'lumotlar `backend/data/*.json` da:

- `services.json` — Xizmatlar
- `videos.json` — Natijalar (video/text)
- `certificates.json` — Sertifikatlar (rasm/text)
- `appointments.json` — Qabulga yozilgan mijozlar
- `schedule.json` — Qabul kunlari
- `admins.json` — Adminlar
- `settings.json` — Sozlamalar

## 6. Ma'lumotlar oqimi (sayt ⇄ bot)

- **Sayt → Bot**: Booking formasi `POST /api/appointments` ga yuboradi → backend `appointments.json` ga yozadi → barcha adminlarga Telegram xabari yuboriladi (tugmalar bilan: qabul qilindi / bog'lanildi / bekor qilindi / o'chirish).
- **Bot → Sayt**: Admin botda xizmat/natija(video)/sertifikat qo'shsa/o'chirsa, tegishli `*.json` fayl yangilanadi. Sayt bu ma'lumotni `GET /api/services`, `/api/videos`, `/api/certificates`, `/api/schedule`, `/api/settings` orqali oladi va ko'rsatadi (agar bot hech narsa qo'shmagan bo'lsa, saytdagi standart namuna matnlari ko'rinadi).
- **Rasm/video**: Bot orqali yuklangan fayllar Telegram serverida saqlanadi (faqat `file_id` bor). Sayt ularni `GET /api/file/:fileId` orqali (backend proksi qiladi, bot tokeni oshkor bo'lmaydi) ko'rsatadi.

## 7. Backendning mustahkamlik choralari

- Bot vaqtincha ulanmasa ham (internet uzilishi va h.k.) sayt/API ishlashda davom etadi, bot 3 marta qayta urinib ulanadi.
- `POST /api/appointments` uchun IP bo'yicha rate-limit (1 daqiqada 5 ta so'rov) va qat'iy validatsiya (ism, telefon, izoh uzunligi).
- `GET /api/file/:fileId` uchun ham rate-limit bor (1 daqiqada 120 so'rov).
- Markazlashtirilgan xato ushlagich — server hech qachon kutilmagan xatolik tufayli yiqilmaydi (`uncaughtException` / `unhandledRejection` ham log qilinadi).
- Asosiy xavfsizlik HTTP header'lari (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- Har bir API so'rovi konsolga log qilinadi (metod, yo'l, status, vaqt).

## 8. Bot menusi

1. Xizmatlar (qo'shish / o'chirish)
2. Natijalar (video yoki text)
3. Sertifikatlar (rasm yoki text)
4. Qabulga yozilgan mijozlar
