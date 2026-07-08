const { adminIds } = require('./auth');



const STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};

const STATUS_LABELS = {
  [STATUS.NEW]: '🟡 Yangi',
  [STATUS.CONTACTED]: '🟢 Bog\'lanildi',
  [STATUS.CONFIRMED]: '🔵 Qabul qilindi',
  [STATUS.CANCELLED]: '🔴 Bekor qilindi',
};

function formatAppointment(a) {
  return (
    `━━━━━━━━━━━━━━\n` +
    `🆕 Qabulga yozilish\n\n` +
    `👤 Ism: ${a.name}\n` +
    `📞 Telefon: ${a.phone}\n` +
    `📅 Sana: ${a.date || '—'}\n` +
    `🕒 Vaqt: ${a.time || '—'}\n` +
    `📝 Izoh: ${a.note || '—'}\n` +
    `📌 Holati: ${STATUS_LABELS[a.status] || STATUS_LABELS[STATUS.NEW]}\n` +
    `━━━━━━━━━━━━━━`
  );
}

function appointmentKeyboard(id) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Qabul qilindi', callback_data: `apt_confirm_${id}` },
        { text: '☎️ Bog\'lanildi', callback_data: `apt_contact_${id}` },
      ],
      [
        { text: '❌ Bekor qilindi', callback_data: `apt_cancel_${id}` },
        { text: '🗑 O\'chirish', callback_data: `apt_delete_${id}` },
      ],
    ],
  };
}

/** Barcha adminlarga xabar yuboradi (kimdir bloklagan bo'lsa, xatoni yutib yuboradi) */
async function notifyAdmins(telegram, text, extra = {}) {
  for (const id of adminIds) {
    try {
      await telegram.sendMessage(id, text, extra);
    } catch (err) {
      console.error(`[notifyAdmins] ${id} ga yuborib bo'lmadi:`, err.message);
    }
  }
}

// Admin holatni o'zgartirganda foydalanuvchiga (agar bot orqali yozilgan bo'lsa,
// ya'ni telegramId mavjud bo'lsa) avtomatik yuboriladigan xabarlar.
const USER_STATUS_MESSAGES = {
  [STATUS.CONFIRMED]: (a) =>
    `✅ <b>Arizangiz qabul qilindi!</b>\n\n` +
    `👤 ${a.name}\n📅 Sana: ${a.date || '—'}\n🕒 Vaqt: ${a.time || '—'}\n\n` +
    `Tez orada operatorimiz siz bilan bog'lanadi. Rahmat!`,
  [STATUS.CONTACTED]: (a) =>
    `☎️ Hurmatli ${a.name}, administratorimiz siz bilan tez orada bog'lanadi.`,
  [STATUS.CANCELLED]: (a) =>
    `❌ Hurmatli ${a.name}, afsuski arizangiz bekor qilindi. Savol bo'lsa, biz bilan bog'laning.`,
};

/**
 * Ariza holati o'zgarganda, agar ariza Telegram bot orqali yozilgan bo'lsa
 * (appointment.telegramId mavjud bo'lsa), foydalanuvchining o'ziga avtomatik
 * xabar yuboradi. Sayt orqali kelgan arizalarda telegramId bo'lmaydi — bu holda
 * hech narsa yuborilmaydi (chunki foydalanuvchining Telegram chat id'si yo'q).
 */
async function notifyUserStatusChange(telegram, appointment, status) {
  if (!telegram || !appointment || !appointment.telegramId) return;
  const buildText = USER_STATUS_MESSAGES[status];
  if (!buildText) return;
  try {
    await telegram.sendMessage(appointment.telegramId, buildText(appointment), { parse_mode: 'HTML' });
  } catch (err) {
    console.error(`[notifyUserStatusChange] ${appointment.telegramId} ga yuborib bo'lmadi:`, err.message);
  }
}

module.exports = {
  STATUS,
  STATUS_LABELS,
  formatAppointment,
  appointmentKeyboard,
  notifyAdmins,
  notifyUserStatusChange,
};
