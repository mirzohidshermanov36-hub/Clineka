const { Telegraf } = require('telegraf');
const { getState, clearState } = require('./utils/state');

const registerStartCommand = require('./commands/start');
const registerServiceHandlers = require('./handlers/adminServices');
const registerVideoHandlers = require('./handlers/adminVideos');
const registerCertificateHandlers = require('./handlers/adminCertificates');
const registerScheduleHandlers = require('./handlers/adminSchedule');
const registerAppointmentHandlers = require('./handlers/adminAppointments');
const registerStatsHandlers = require('./handlers/adminStats');
const registerUserMenuHandlers = require('./handlers/userMenu');
const registerBookingHandlers = require('./handlers/userBooking');

function createBot(token) {
  const bot = new Telegraf(token);

  // Buyruqlar va tugma (action) handlerlarni ro'yxatdan o'tkazish.
  // Har biri o'zining matn/rasm/video qadamlarini boshqarish uchun funksiyalar qaytaradi.
  registerStartCommand(bot);
  const services = registerServiceHandlers(bot);
  const videos = registerVideoHandlers(bot);
  const certificates = registerCertificateHandlers(bot);
  const schedule = registerScheduleHandlers(bot);
  registerAppointmentHandlers(bot);
  registerStatsHandlers(bot);
  registerUserMenuHandlers(bot);
  const booking = registerBookingHandlers(bot);

  // Har qanday ko'p bosqichli jarayonni bekor qilish
  bot.action('flow_cancel', async (ctx) => {
    clearState(ctx.from.id);
    await ctx.answerCbQuery('Bekor qilindi');
    await ctx.editMessageText('❌ Amal bekor qilindi.').catch(() => {});
  });

  // Matnli xabarlarni foydalanuvchi holatiga (state) qarab tegishli modulga yo'naltirish
  bot.on('text', async (ctx, next) => {
    const state = getState(ctx.from.id);
    if (!state) return next();

    if (state.action === 'add_service' || state.action === 'edit_service') return services.handleText(ctx, state);
    if (state.action === 'add_video') return videos.handleText(ctx, state);
    if (state.action === 'add_cert') return certificates.handleText(ctx, state);
    if (state.action === 'set_schedule') return schedule.handleText(ctx, state);
    if (state.action === 'book_appointment') return booking.handleText(ctx, state);

    return next();
  });

  // Rasm xabarlarini yo'naltirish
  bot.on('photo', async (ctx, next) => {
    const state = getState(ctx.from.id);
    if (!state) return next();

    if (state.action === 'add_service' || state.action === 'edit_service') return services.handlePhoto(ctx, state);
    if (state.action === 'add_cert') return certificates.handlePhoto(ctx, state);

    return next();
  });

  // Video xabarlarni yo'naltirish
  bot.on('video', async (ctx, next) => {
    const state = getState(ctx.from.id);
    if (!state) return next();

    if (state.action === 'add_video') return videos.handleVideo(ctx, state);

    return next();
  });

  bot.catch((err, ctx) => {
    console.error(`[bot] Xatolik (${ctx.updateType}):`, err);
  });

  return bot;
}

module.exports = { createBot };
