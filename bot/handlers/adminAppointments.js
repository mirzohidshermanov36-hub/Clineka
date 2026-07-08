const { isAdmin } = require('../utils/auth');
const { readJSON, writeJSON } = require('../utils/db');
const { STATUS, formatAppointment, appointmentKeyboard, notifyUserStatusChange } = require('../utils/appointments');
const { backButton } = require('../keyboards/adminKeyboards');

const FILE = 'appointments.json';
const LIST_LIMIT = 10;

function registerAppointmentHandlers(bot) {
  bot.action('admin_appointments', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    const appointments = readJSON(FILE, []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (appointments.length === 0) {
      return ctx.editMessageText('📅 Hozircha qabulga yozilganlar yo\'q.', backButton()).catch(() =>
        ctx.reply('📅 Hozircha qabulga yozilganlar yo\'q.', backButton())
      );
    }

    await ctx.editMessageText(`📅 <b>Qabulga yozilganlar</b> (oxirgi ${Math.min(LIST_LIMIT, appointments.length)} ta):`, {
      parse_mode: 'HTML',
      ...backButton(),
    }).catch(() => {});

    for (const a of appointments.slice(0, LIST_LIMIT)) {
      await ctx.reply(formatAppointment(a), { reply_markup: appointmentKeyboard(a.id) });
    }
  });

  function updateStatus(actionPrefix, status, label) {
    bot.action(new RegExp(`^${actionPrefix}_(.+)$`), async (ctx) => {
      if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
      const id = ctx.match[1];
      const appointments = readJSON(FILE, []);
      const idx = appointments.findIndex((a) => a.id === id);
      if (idx === -1) return ctx.answerCbQuery('Topilmadi');
      appointments[idx].status = status;
      writeJSON(FILE, appointments);
      await ctx.answerCbQuery(`${label} ✅`);
      await ctx.editMessageText(formatAppointment(appointments[idx]), {
        reply_markup: appointmentKeyboard(id),
      }).catch(() => {});
      // Foydalanuvchiga (agar bot orqali yozilgan bo'lsa) avtomatik xabar +
      // holat db'da allaqachon yangilangan (yuqorida writeJSON bilan).
      await notifyUserStatusChange(ctx.telegram, appointments[idx], status);
    });
  }

  updateStatus('apt_confirm', STATUS.CONFIRMED, 'Qabul qilindi');
  updateStatus('apt_contact', STATUS.CONTACTED, 'Bog\'lanildi');
  updateStatus('apt_cancel', STATUS.CANCELLED, 'Bekor qilindi');

  bot.action(/^apt_delete_(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    const id = ctx.match[1];
    const appointments = readJSON(FILE, []);
    writeJSON(FILE, appointments.filter((a) => a.id !== id));
    await ctx.answerCbQuery('O\'chirildi ✅');
    await ctx.editMessageText('🗑 Yozuv o\'chirildi.').catch(() => {});
  });
}

module.exports = registerAppointmentHandlers;
