import { reactive, computed } from 'vue'

const state = reactive({ lang: 'uz' })

export const messages = {
  uz: {
    nav: {
      address: "Toshkent, Olmazor tumani, Abdulla Qodiriy ko'chasi, 15",
      hours: 'Dushanba - Shanba: 09:00 - 18:00',
      links: {
        doktor: 'Doktor haqida', xizmatlar: 'Xizmatlar', natijalar: 'Natijalar',
        narxlar: 'Narxlar', 'savol-javob': 'Savol-javob', sertifikatlar: 'Sertifikatlar', 'ish-vaqti': 'Ish vaqti',
      },
      book: "Bog'lanish", menu: 'Menyu',
    },
    hero: {
      badge: "Toshkentdagi bolalar urologiyasi bo'yicha mutaxassis",
      title1: 'Toshkentdagi ', title2: 'bolalar urologi', title3: ' Bekzod Abdiyev bilan', title4: 'ishonchli davolanish',
      desc: "Tajribali bolalar urologi Bekzod Abdiyev tomonidan fimoz, gidrotsele, kriptorxizm, enurez va boshqa bolalar urologik kasalliklari zamonaviy diagnostika hamda samarali davolash usullari orqali davolanadi.",
      book: 'Qabulga yozilish', services: 'Xizmatlar bilan tanishish',
      stats: { patients: 'bemor ishonchi', years: 'tajriba', success: 'ijobiy natija', todayLabel: 'Bugun qabul:', dayOff: 'dam olish kuni' },
      cardBadge: 'Bolalar urologiyasi', doctorName: 'Bekzod Abdiev', doctorRole: 'Bolalar urologi',
      reviews: '5.0 · 320+ sharh',
      exp: '8+ yillik tajriba', expSub: 'Bolalar urologiyasi sohasida',
      patients: '1000+ bemor', patientsSub: 'Muvaffaqiyatli davolangan',
      bio1: "Men bolalar urologiyasi sohasida 8 yildan ortiq tajribaga egaman. Bolajonlaringiz uchun sifatli tashxis va zamonaviy davolash usullarini qo'llab, ular sog'lom o'sishiga yordam beraman.",
      bio2: "Ishimning maqsadi — har bir bolaga individual yondashuv, aniqlik va eng samarali davolash usullarini taqdim etish.",
      more: "Batafsil ma'lumot",
    },
    services: {
      badge: 'Xizmatlarimiz', title: "Bolalar urologiyasi bo'yicha to'liq xizmatlar",
      sub: "Batafsil ma'lumot olish uchun kartochkaga bosing",
      more: 'Batafsil', less: 'Yopish', empty: "Hozircha ma'lumot yo'q",
      items: [],
    },
    results: {
      badge: 'Natijalar & Mijozlar fikri', title1: 'Bizning natijalarimiz', title2: 'sizning ishonchingizda',
      desc: 'Yillar davomida minglab bolalarning salomatligi uchun ishlab, eng yuqori natijalarga erishdik.',
      stats: ['Davolangan bemorlar', 'Yillik tajriba', 'Bemorlar mamnuniyati', 'Muvaffaqiyatli operatsiya'],
      testimonials: [],
      empty: "Hozircha ma'lumot yo'q",
    },
    pricing: {
      badge: 'Narxlar', title: 'Har bir oilaga mos xizmat paketlari', popular: "Eng ko'p tanlanadigan",
      perConsult: '/konsultatsiya', choose: 'Tanlash',
      plans: [
        { name: 'Asosiy Paket', features: ['Konsultatsiya', "Tashqi ko'rik", 'Tavsiyalar', 'Nazorat qaydnoma'] },
        { name: 'Standart Paket', features: ['Konsultatsiya', 'Tekshiruv va tashxis', 'UZI natijasi', 'Davolash rejasi', 'Nazorat qaydnoma'] },
        { name: 'Premium Paket', features: ['Konsultatsiya', "To'liq tekshiruv", 'UZI + Laboratoriya', "Operatsiya (agar kerak bo'lsa)", 'Doktor bilan doimiy aloqa'] },
      ],
    },
    faq: {
      badge: 'Savol-javob', title: "Ko'p beriladigan savollar",
      items: [], empty: "Hozircha ma'lumot yo'q",
    },
    certs: {
      badge: 'Sertifikatlar', title: 'Malaka va tajribamizni tasdiqlaydigan hujjatlar',
      prev: 'Oldingi', next: 'Keyingi', close: 'Yopish', issued: 'yilda berilgan', empty: "Hozircha ma'lumot yo'q",
      items: [],
    },
    hours: {
      badge: 'Ish vaqti', title: 'Qabul jadvali',
      open: 'Hozir qabul davom etmoqda', closed: 'Hozir qabulxona yopiq', dayOff: 'Dam olish kuni',
      days: ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'],
    },
    booking: {
      title: 'Qabulga yozilish',
      desc: "Ma'lumotlaringizni qoldiring, administratorimiz 15 daqiqa ichida bog'lanadi.",
      name: 'Farzandingiz/Sizning ismingiz', namePh: 'Ism Familiya',
      phone: 'Telefon raqam', phonePh: '998901234567',
      date: 'Qulay sana (ixtiyoriy)', note: 'Izoh (ixtiyoriy)', notePh: 'Savolingiz yoki tanlangan paket',
      submit: 'Yuborish', close: 'Yopish',
      errName: "Ismingizni to'liq kiriting", errPhone: "Telefon raqamni to'g'ri kiriting",
      selectedPkg: 'Tanlangan paket',
      okTitle: "So'rovingiz qabul qilindi!",
      okDesc1: 'Rahmat', okDesc2: "Tez orada raqamingizga qo'ng'iroq qilamiz.",
    },
    footer: {
      about: "Bolalar urologiyasi bo'yicha ishonchli va mehribon yordam — har bir bola uchun.",
      services: 'Xizmatlar', info: "Ma'lumotlar",
      infoLinks: [
        { id: 'doktor', label: 'Doktor haqida', icon: 'users' },
        { id: 'natijalar', label: 'Natijalar', icon: 'check' },
        { id: 'sertifikatlar', label: 'Sertifikatlar', icon: 'ribbon' },
        { id: 'savol-javob', label: 'Savol-javob', icon: 'shield' },
      ],
      serviceLinks: [
        { id: 'xizmatlar', label: 'Kriptorxizm', icon: 'shield' },
        { id: 'xizmatlar', label: 'Sirkumsiziya', icon: 'ribbon' },
        { id: 'xizmatlar', label: "Siydik yo'llari infeksiyasi", icon: 'drop' },
        { id: 'xizmatlar', label: 'Gidrotsele', icon: 'drop' },
      ],
      newsletterTitle: "Foydali maslahatlar va yangiliklar uchun obuna bo'ling",
      emailPh: 'Email manzilingiz',
      subscribed: "Muhim yangiliklarni o'tkazib yubormang!",
      subscribedDesc: "Obuna bo'ling va foydali ma'lumotlarni oling.",
      copyright: "Bekzod Abdiev — Bolalar urologi. Barcha huquqlar himoyalangan.",
      privacy: 'Maxfiylik siyosati', terms: 'Foydalanish shartlari', contact: 'Aloqa',
    },
  },
  ru: {
    nav: {
      address: 'Ташкент, Алмазарский район, ул. Абдуллы Кадыри, 15',
      hours: 'Понедельник - Суббота: 09:00 - 18:00',
      links: {
        doktor: 'О враче', xizmatlar: 'Услуги', natijalar: 'Результаты',
        narxlar: 'Цены', 'savol-javob': 'Вопросы', sertifikatlar: 'Сертификаты', 'ish-vaqti': 'Часы работы',
      },
      book: 'Связаться', menu: 'Меню',
    },
    hero: {
      badge: 'Специалист по детской урологии в Ташкенте',
      title1: 'Надёжное лечение с ', title2: 'детским урологом', title3: ' Бекзодом Абдиевым', title4: 'в Ташкенте',
      desc: 'Опытный детский уролог Бекзод Абдиев проводит диагностику и лечение фимоза, гидроцеле, крипторхизма, энуреза и других детских урологических заболеваний с помощью современных методик.',
      book: 'Записаться на приём', services: 'Ознакомиться с услугами',
      stats: { patients: 'доверия пациентов', years: 'опыта', success: 'положительных результатов', todayLabel: 'Сегодня приём:', dayOff: 'выходной' },
      cardBadge: 'Детская урология', doctorName: 'Бекзод Абдиев', doctorRole: 'Детский уролог',
      reviews: '5.0 · 320+ отзывов',
      exp: '8+ лет опыта', expSub: 'В сфере детской урологии',
      patients: '1000+ пациентов', patientsSub: 'Успешно вылечены',
      bio1: 'Я работаю в сфере детской урологии более 8 лет. Провожу качественную диагностику и современные методы лечения для здоровья ваших детей.',
      bio2: 'Моя цель — индивидуальный подход к каждому ребёнку, точность и самые эффективные методы лечения.',
      more: 'Подробнее',
    },
    services: {
      badge: 'Наши услуги', title: 'Полный спектр услуг детской урологии',
      sub: 'Нажмите на карточку для подробной информации',
      more: 'Подробнее', less: 'Закрыть', empty: 'Пока нет информации',
      items: [],
    },
    results: {
      badge: 'Результаты и отзывы', title1: 'Наши результаты —', title2: 'ваше доверие',
      desc: 'За годы работы для здоровья тысяч детей мы достигли самых высоких результатов.',
      stats: ['Вылеченных пациентов', 'Лет опыта', 'Удовлетворённость пациентов', 'Успешных операций'],
      testimonials: [],
      empty: 'Пока нет информации',
    },
    pricing: {
      badge: 'Цены', title: 'Пакеты услуг для каждой семьи', popular: 'Самый популярный',
      perConsult: '/консультация', choose: 'Выбрать',
      plans: [
        { name: 'Базовый пакет', features: ['Консультация', 'Внешний осмотр', 'Рекомендации', 'Контрольная запись'] },
        { name: 'Стандартный пакет', features: ['Консультация', 'Обследование и диагноз', 'Результаты УЗИ', 'План лечения', 'Контрольная запись'] },
        { name: 'Премиум пакет', features: ['Консультация', 'Полное обследование', 'УЗИ + Лаборатория', 'Операция (при необходимости)', 'Постоянная связь с врачом'] },
      ],
    },
    faq: {
      badge: 'Вопрос-ответ', title: 'Часто задаваемые вопросы',
      items: [], empty: 'Пока нет информации',
    },
    certs: {
      badge: 'Сертификаты', title: 'Документы, подтверждающие квалификацию',
      prev: 'Предыдущий', next: 'Следующий', close: 'Закрыть', issued: 'год выдачи', empty: 'Пока нет информации',
      items: [],
    },
    hours: {
      badge: 'Часы работы', title: 'График приёма',
      open: 'Сейчас идёт приём', closed: 'Сейчас закрыто', dayOff: 'Выходной',
      days: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
    },
    booking: {
      title: 'Записаться на приём',
      desc: 'Оставьте свои данные, администратор свяжется в течение 15 минут.',
      name: 'Ваше имя / имя ребёнка', namePh: 'Имя Фамилия',
      phone: 'Номер телефона', phonePh: '998901234567',
      date: 'Удобная дата (необязательно)', note: 'Комментарий (необязательно)', notePh: 'Ваш вопрос или выбранный пакет',
      submit: 'Отправить', close: 'Закрыть',
      errName: 'Введите ваше имя полностью', errPhone: 'Введите правильный номер телефона',
      selectedPkg: 'Выбранный пакет',
      okTitle: 'Ваша заявка принята!',
      okDesc1: 'Спасибо', okDesc2: 'Скоро мы позвоним вам.',
    },
    footer: {
      about: 'Надёжная и заботливая помощь по детской урологии — для каждого ребёнка.',
      services: 'Услуги', info: 'Информация',
      infoLinks: [
        { id: 'doktor', label: 'О враче', icon: 'users' },
        { id: 'natijalar', label: 'Результаты', icon: 'check' },
        { id: 'sertifikatlar', label: 'Сертификаты', icon: 'ribbon' },
        { id: 'savol-javob', label: 'Вопрос-ответ', icon: 'shield' },
      ],
      serviceLinks: [
        { id: 'xizmatlar', label: 'Крипторхизм', icon: 'shield' },
        { id: 'xizmatlar', label: 'Обрезание', icon: 'ribbon' },
        { id: 'xizmatlar', label: 'Инфекции мочевых путей', icon: 'drop' },
        { id: 'xizmatlar', label: 'Гидроцеле', icon: 'drop' },
      ],
      newsletterTitle: 'Подпишитесь на полезные советы и новости',
      emailPh: 'Ваш email',
      subscribed: 'Не пропустите важные новости!',
      subscribedDesc: 'Подпишитесь и получайте полезную информацию.',
      copyright: 'Бекзод Абдиев — Детский уролог. Все права защищены.',
      privacy: 'Политика конфиденциальности', terms: 'Условия использования', contact: 'Контакты',
    },
  },
  en: {
    nav: {
      address: 'Tashkent, Olmazor district, Abdulla Qodiriy street, 15',
      hours: 'Monday - Saturday: 09:00 - 18:00',
      links: {
        doktor: 'About Doctor', xizmatlar: 'Services', natijalar: 'Results',
        narxlar: 'Prices', 'savol-javob': 'FAQ', sertifikatlar: 'Certificates', 'ish-vaqti': 'Working Hours',
      },
      book: 'Contact', menu: 'Menu',
    },
    hero: {
      badge: "Tashkent's specialist in pediatric urology",
      title1: 'Reliable treatment with ', title2: 'pediatric urologist', title3: ' Bekzod Abdiyev', title4: 'in Tashkent',
      desc: 'Experienced pediatric urologist Bekzod Abdiyev treats phimosis, hydrocele, cryptorchidism, enuresis and other childhood urological conditions with modern diagnostics and effective methods.',
      book: 'Book appointment', services: 'Explore services',
      stats: { patients: 'patient trust', years: 'experience', success: 'positive outcomes', todayLabel: 'Today:', dayOff: 'day off' },
      cardBadge: 'Pediatric urology', doctorName: 'Bekzod Abdiev', doctorRole: 'Pediatric urologist',
      reviews: '5.0 · 320+ reviews',
      exp: '8+ years experience', expSub: 'In pediatric urology',
      patients: '1000+ patients', patientsSub: 'Successfully treated',
      bio1: "I have over 8 years of experience in pediatric urology. I provide quality diagnostics and modern treatment for your children's healthy growth.",
      bio2: 'My goal is an individual approach for every child, accuracy and the most effective treatment methods.',
      more: 'Learn more',
    },
    services: {
      badge: 'Our services', title: 'Complete pediatric urology services',
      sub: 'Click a card for details',
      more: 'Details', less: 'Close', empty: 'No information yet',
      items: [],
    },
    results: {
      badge: 'Results & Reviews', title1: 'Our results —', title2: 'your trust',
      desc: 'Over years working for the health of thousands of children, we have achieved outstanding results.',
      stats: ['Treated patients', 'Years of experience', 'Patient satisfaction', 'Successful surgeries'],
      testimonials: [],
      empty: 'No information yet',
    },
    pricing: {
      badge: 'Prices', title: 'Service packages for every family', popular: 'Most popular',
      perConsult: '/consultation', choose: 'Choose',
      plans: [
        { name: 'Basic Package', features: ['Consultation', 'External examination', 'Recommendations', 'Follow-up note'] },
        { name: 'Standard Package', features: ['Consultation', 'Examination and diagnosis', 'Ultrasound', 'Treatment plan', 'Follow-up note'] },
        { name: 'Premium Package', features: ['Consultation', 'Full examination', 'Ultrasound + Labs', 'Surgery (if needed)', 'Ongoing contact with doctor'] },
      ],
    },
    faq: {
      badge: 'FAQ', title: 'Frequently asked questions',
      items: [], empty: 'No information yet',
    },
    certs: {
      badge: 'Certificates', title: 'Documents confirming our qualifications',
      prev: 'Previous', next: 'Next', close: 'Close', issued: 'issued in', empty: 'No information yet',
      items: [],
    },
    hours: {
      badge: 'Working hours', title: 'Reception schedule',
      open: 'Reception is open now', closed: 'Reception is closed', dayOff: 'Day off',
      days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    },
    booking: {
      title: 'Book appointment',
      desc: "Leave your details and our administrator will contact you within 15 minutes.",
      name: 'Your / child\'s name', namePh: 'First Last',
      phone: 'Phone number', phonePh: '998901234567',
      date: 'Preferred date (optional)', note: 'Note (optional)', notePh: 'Your question or chosen package',
      submit: 'Send', close: 'Close',
      errName: 'Enter your full name', errPhone: 'Enter a correct phone number',
      selectedPkg: 'Selected package',
      okTitle: 'Your request received!',
      okDesc1: 'Thanks', okDesc2: 'We will call you soon.',
    },
    footer: {
      about: 'Reliable and caring pediatric urology support — for every child.',
      services: 'Services', info: 'Information',
      infoLinks: [
        { id: 'doktor', label: 'About doctor', icon: 'users' },
        { id: 'natijalar', label: 'Results', icon: 'check' },
        { id: 'sertifikatlar', label: 'Certificates', icon: 'ribbon' },
        { id: 'savol-javob', label: 'FAQ', icon: 'shield' },
      ],
      serviceLinks: [
        { id: 'xizmatlar', label: 'Cryptorchidism', icon: 'shield' },
        { id: 'xizmatlar', label: 'Circumcision', icon: 'ribbon' },
        { id: 'xizmatlar', label: 'Urinary tract infections', icon: 'drop' },
        { id: 'xizmatlar', label: 'Hydrocele', icon: 'drop' },
      ],
      newsletterTitle: 'Subscribe for useful tips and news',
      emailPh: 'Your email',
      subscribed: "Don't miss important news!",
      subscribedDesc: 'Subscribe and receive useful information.',
      copyright: 'Bekzod Abdiev — Pediatric urologist. All rights reserved.',
      privacy: 'Privacy policy', terms: 'Terms of use', contact: 'Contact',
    },
  },
}

export function useI18n() {
  const t = computed(() => messages[state.lang])
  const setLang = (l) => { if (messages[l]) state.lang = l }
  const lang = computed(() => state.lang)
  return { t, lang, setLang }
}

export const languages = [
  { code: 'uz', label: "O'zbek" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
]
