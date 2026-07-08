const { readJSON, writeJSON, generateId } = require('./db');
const { STATUS, formatAppointment, appointmentKeyboard, notifyAdmins } = require('./appointments');

const FILE = 'appointments.json';

/**
 * Yangi appointment yaratadi, appointments.json ga saqlaydi va barcha adminlarga
 * Telegram orqali xabar yuboradi (inline tugmalar bilan).
 * @param {object} telegram - bot.telegram instansiyasi (sendMessage uchun)
 * @param {object} payload - { name, phone, date, time, note, source }
 */
async function createAppointment(telegram, payload) {
  const appointments = readJSON(FILE, []);
  const appointment = {
    id: generateId(),
    name: payload.name,
    phone: payload.phone,
    date: payload.date || '',
    time: payload.time || '',
    note: payload.note || '',
    status: STATUS.NEW,
    source: payload.source || 'bot',
    // Foydalanuvchi botning o'zi orqali yozilgan bo'lsa, uning Telegram chat id'si
    // shu yerda saqlanadi — admin holatni o'zgartirganda unga avtomatik javob
    // yuborish uchun kerak. Sayt orqali kelgan arizalarda bu bo'sh bo'ladi.
    telegramId: payload.telegramId || null,
    createdAt: new Date().toISOString(),
  };
  appointments.push(appointment);
  writeJSON(FILE, appointments);

  if (telegram) {
    await notifyAdmins(telegram, formatAppointment(appointment), {
      reply_markup: appointmentKeyboard(appointment.id),
    });
  }

  return appointment;
}

module.exports = { createAppointment, FILE };
