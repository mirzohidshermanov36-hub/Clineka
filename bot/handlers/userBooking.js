const { setState, updateState, getState, clearState } = require('../utils/state');
const { userMainMenu, confirmCancelKeyboard, backToUserMenu } = require('../keyboards/userKeyboards');
const { createAppointment } = require('../utils/appointmentService');

function registerBookingHandlers(bot) {
  bot.action('user_book', async (ctx) => {
    await ctx.answerCbQuery();
    setState(ctx.from.id, { action: 'book_appointment', step: 'name', data: {} });
    await ctx.reply('📅 <b>Qabulga yozilish</b>\n\n1️⃣ Ism va familiyangizni kiriting:', { parse_mode: 'HTML' });
  });

  bot.action('booking_cancel', async (ctx) => {
    await ctx.answerCbQuery();
    clearState(ctx.from.id);
    await ctx.editMessageText('❌ Qabulga yozilish bekor qilindi.').catch(() => {});
    await ctx.reply('🏥 Bosh menyu:', userMainMenu());
  });

  bot.action('booking_confirm', async (ctx) => {
    const state = getState(ctx.from.id);
    if (!state || state.action !== 'book_appointment') return ctx.answerCbQuery();
    await ctx.answerCbQuery();

    const appointment = await createAppointment(ctx.telegram, {
      ...state.data,
      source: 'bot',
      telegramId: ctx.from.id,
    });

    clearState(ctx.from.id);
    await ctx.editMessageText(
      `✅ Rahmat, ${appointment.name}! Arizangiz qabul qilindi.\nTez orada operatorimiz siz bilan <b>${appointment.phone}</b> raqami orqali bog'lanadi.`,
      { parse_mode: 'HTML' }
    ).catch(() => {});
    await ctx.reply('🏥 Bosh menyu:', userMainMenu());
  });

  async function handleText(ctx, state) {
    if (state.action !== 'book_appointment') return;
    const { step, data } = state;
    const text = ctx.message.text.trim();

    if (step === 'name') {
      if (text.length < 2) return ctx.reply('⚠️ Iltimos, to\'liq ism familiyangizni kiriting:');
      updateState(ctx.from.id, { step: 'phone', data: { ...data, name: text } });
      return ctx.reply('2️⃣ Telefon raqamingizni kiriting (masalan: +998901234567):');
    }

    if (step === 'phone') {
      const digits = text.replace(/\D/g, '');
      if (digits.length < 9) return ctx.reply('⚠️ Telefon raqami noto\'g\'ri. Qaytadan kiriting:');
      updateState(ctx.from.id, { step: 'date', data: { ...data, phone: text } });
      return ctx.reply('3️⃣ Qabul sanasini kiriting (masalan: 25.07.2026):');
    }

    if (step === 'date') {
      updateState(ctx.from.id, { step: 'time', data: { ...data, date: text } });
      return ctx.reply('4️⃣ Qabul vaqtini kiriting (masalan: 14:30):');
    }

    if (step === 'time') {
      updateState(ctx.from.id, { step: 'note', data: { ...data, time: text } });
      return ctx.reply('5️⃣ Izoh qoldiring (yoki "-" deb yozing):');
    }

    if (step === 'note') {
      const finalData = { ...data, note: text === '-' ? '' : text };
      updateState(ctx.from.id, { step: 'confirm', data: finalData });
      const summary =
        `📋 <b>Ma'lumotlaringizni tekshiring:</b>\n\n` +
        `👤 Ism: ${finalData.name}\n` +
        `📞 Telefon: ${finalData.phone}\n` +
        `📅 Sana: ${finalData.date}\n` +
        `🕒 Vaqt: ${finalData.time}\n` +
        `📝 Izoh: ${finalData.note || '—'}`;
      return ctx.reply(summary, { parse_mode: 'HTML', ...confirmCancelKeyboard() });
    }
  }

  return { handleText };
}

module.exports = registerBookingHandlers;
