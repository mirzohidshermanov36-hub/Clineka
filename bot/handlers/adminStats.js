const { isAdmin } = require('../utils/auth');
const { readJSON } = require('../utils/db');
const { backButton } = require('../keyboards/adminKeyboards');

const FILE = 'appointments.json';

function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function startOfWeek(d) {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7; // Monday = 0
  x.setDate(x.getDate() - day);
  return x;
}
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }

function registerStatsHandlers(bot) {
  bot.action('admin_stats', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();

    const appointments = readJSON(FILE, []);
    const now = new Date();
    const dayStart = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    const today = appointments.filter((a) => new Date(a.createdAt) >= dayStart).length;
    const week = appointments.filter((a) => new Date(a.createdAt) >= weekStart).length;
    const month = appointments.filter((a) => new Date(a.createdAt) >= monthStart).length;
    const total = appointments.length;

    const text =
      `📊 <b>Statistika</b>\n\n` +
      `📆 Bugungi murojaatlar: <b>${today}</b>\n` +
      `🗓 Haftalik murojaatlar: <b>${week}</b>\n` +
      `📅 Oylik murojaatlar: <b>${month}</b>\n` +
      `📈 Jami murojaatlar: <b>${total}</b>`;

    await ctx.editMessageText(text, { parse_mode: 'HTML', ...backButton() }).catch(() =>
      ctx.reply(text, { parse_mode: 'HTML', ...backButton() })
    );
  });
}

module.exports = registerStatsHandlers;
