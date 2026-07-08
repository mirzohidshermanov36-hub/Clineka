const { isAdmin } = require('../utils/auth');
const { readJSON, writeJSON } = require('../utils/db');
const { setState, updateState, clearState } = require('../utils/state');
const { scheduleListKeyboard, scheduleDayKeyboard, DAYS } = require('../keyboards/scheduleKeyboards');
const { cancelKeyboard } = require('../keyboards/adminKeyboards');

const FILE = 'schedule.json';
const DAY_LABELS = Object.fromEntries(DAYS.map((d) => [d.key, d.label]));

function registerScheduleHandlers(bot) {
  bot.action('admin_schedule', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    clearState(ctx.from.id);
    await ctx.answerCbQuery();
    const schedule = readJSON(FILE, {});
    await ctx.editMessageText('🕒 <b>Qabul jadvali</b>\n\nKunni tanlang:', {
      parse_mode: 'HTML',
      ...scheduleListKeyboard(schedule),
    }).catch(() => ctx.reply('🕒 <b>Qabul jadvali</b>', { parse_mode: 'HTML', ...scheduleListKeyboard(schedule) }));
  });

  bot.action(/^sched_day_(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    const day = ctx.match[1];
    await ctx.answerCbQuery();
    const schedule = readJSON(FILE, {});
    const d = schedule[day] || {};
    const info = d.dayOff ? '❌ Dam olish kuni' : `${d.start || '--:--'} — ${d.end || '--:--'}`;
    await ctx.reply(`📅 <b>${DAY_LABELS[day]}</b>\nJoriy holat: ${info}\n\nNima qilishni tanlang:`, {
      parse_mode: 'HTML',
      ...scheduleDayKeyboard(day),
    });
  });

  bot.action(/^sched_off_(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    const day = ctx.match[1];
    const schedule = readJSON(FILE, {});
    schedule[day] = { start: '', end: '', dayOff: true };
    writeJSON(FILE, schedule);
    await ctx.answerCbQuery('Saqlandi ✅');
    await ctx.editMessageText(`✅ ${DAY_LABELS[day]} — ❌ Dam olish kuni deb belgilandi.`);
  });

  bot.action(/^sched_set_(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    const day = ctx.match[1];
    await ctx.answerCbQuery();
    setState(ctx.from.id, { action: 'set_schedule', step: 'start', data: { day } });
    await ctx.reply(`🕒 ${DAY_LABELS[day]} uchun boshlanish vaqtini kiriting (masalan: 09:00):`, cancelKeyboard());
  });

  async function handleText(ctx, state) {
    const { action, step, data } = state;
    if (action !== 'set_schedule') return;
    const text = ctx.message.text.trim();

    if (step === 'start') {
      if (!/^\d{1,2}:\d{2}$/.test(text)) {
        return ctx.reply('⚠️ Noto\'g\'ri format. Masalan: 09:00 shaklida kiriting:');
      }
      updateState(ctx.from.id, { step: 'end', data: { ...data, start: text } });
      return ctx.reply('🕒 Endi tugash vaqtini kiriting (masalan: 18:00):', cancelKeyboard());
    }

    if (step === 'end') {
      if (!/^\d{1,2}:\d{2}$/.test(text)) {
        return ctx.reply('⚠️ Noto\'g\'ri format. Masalan: 18:00 shaklida kiriting:');
      }
      const schedule = readJSON(FILE, {});
      schedule[data.day] = { start: data.start, end: text, dayOff: false };
      writeJSON(FILE, schedule);
      clearState(ctx.from.id);
      return ctx.reply(`✅ ${DAY_LABELS[data.day]}: ${data.start} — ${text} deb saqlandi.`);
    }
  }

  return { handleText };
}

module.exports = registerScheduleHandlers;
