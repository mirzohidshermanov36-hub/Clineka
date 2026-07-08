const { Markup } = require('telegraf');

const DAYS = [
  { key: 'dushanba', label: 'Dushanba' },
  { key: 'seshanba', label: 'Seshanba' },
  { key: 'chorshanba', label: 'Chorshanba' },
  { key: 'payshanba', label: 'Payshanba' },
  { key: 'juma', label: 'Juma' },
  { key: 'shanba', label: 'Shanba' },
  { key: 'yakshanba', label: 'Yakshanba' },
];

function scheduleListKeyboard(schedule) {
  const rows = DAYS.map((d) => {
    const day = schedule[d.key] || {};
    const info = day.dayOff ? '❌ Dam olish' : `${day.start || '--:--'}–${day.end || '--:--'}`;
    return [Markup.button.callback(`${d.label}: ${info}`, `sched_day_${d.key}`)];
  });
  rows.push([Markup.button.callback('🔙 Orqaga', 'admin_home')]);
  return Markup.inlineKeyboard(rows);
}

function scheduleDayKeyboard(dayKey) {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🕒 Vaqtni belgilash', `sched_set_${dayKey}`)],
    [Markup.button.callback('❌ Dam olish kuni qilish', `sched_off_${dayKey}`)],
    [Markup.button.callback('🔙 Orqaga', 'admin_schedule')],
  ]);
}

module.exports = { DAYS, scheduleListKeyboard, scheduleDayKeyboard };
