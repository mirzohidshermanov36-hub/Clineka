# Dr. Sardor Rustamov — Bolalar Urologi (Vue.js landing page)

## Ishga tushirish (development rejimida ko'rish uchun)
1. Node.js o'rnatilganini tekshiring (v18+)
2. Terminalda loyiha papkasiga kiring: cd bolalar-urolog
3. Kerakli paketlarni o'rnating: npm install
4. Loyihani ishga tushiring: npm run dev
5. Brauzerda ko'rsatilgan manzilni (odatda http://localhost:5173) oching.

## Tayyor saytni ochish (build qilingan versiya, dist papkasi)
`dist` papkasida sayt allaqachon build qilingan.
1. Terminalda dist papkasiga kiring: cd bolalar-urolog/dist
2. Kichik lokal server ishga tushiring: python3 -m http.server 8080
3. Brauzerda oching: http://localhost:8080

(index.html faylini to'g'ridan-to'g'ri ikki marta bosib ochish ba'zi brauzerlarda
modul xatosi berishi mumkin, shuning uchun lokal server orqali ochish tavsiya etiladi.)

## Qayta build qilish
Kod o'zgartirilgandan so'ng: npm run build
Natija dist papkasida yig'iladi.

## Loyiha tuzilishi
- src/components/NavBar.vue — sticky menyu, mobil menyu, faol bo'limni kuzatish
- src/components/Hero.vue — bosh banner + doktor haqida (1-band)
- src/components/Services.vue — xizmatlar (2-band)
- src/components/Results.vue — natijalar, animatsiyali statistika (3-band)
- src/components/Testimonials.vue — mijozlar fikri, karusel (4-band)
- src/components/Pricing.vue — narxlar (5-band)
- src/components/FAQ.vue — savol-javob, akkordeon (6-band)
- src/components/Certificates.vue — sertifikatlar, karusel + lightbox (7-band)
- src/components/WorkingHours.vue — ish vaqti, jonli status (8-band)
- src/components/Contact.vue — aloqa, forma + xarita (9-band)
- src/components/BookingModal.vue — "Qabulga yozilish" formasi (validatsiya bilan)
- src/components/Footer.vue — footer

## Texnologiya
Vue 3 (Composition API, script setup) + Vite. Tashqi backend yo'q, barcha formalar
frontendda validatsiya qilinadi va muvaffaqiyat holatini ko'rsatadi. Haqiqiy xabar
yuborish (SMS/email) uchun backend yoki xizmat (masalan, Telegram Bot API) ulash kerak.
