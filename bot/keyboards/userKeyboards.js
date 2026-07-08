const { Markup } = require('telegraf');

const userMainMenu = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('📅 Qabulga yozilish', 'user_book')],
    [Markup.button.callback('📋 Xizmatlar', 'user_services')],
    [Markup.button.callback('🎥 Natijalar', 'user_videos')],
    [Markup.button.callback('📞 Bog\'lanish', 'user_contact')],
  ]);

const backToUserMenu = () =>
  Markup.inlineKeyboard([[Markup.button.callback('🔙 Bosh menyu', 'user_home')]]);

const confirmCancelKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('✅ Tasdiqlash', 'booking_confirm')],
    [Markup.button.callback('❌ Bekor qilish', 'booking_cancel')],
  ]);

module.exports = { userMainMenu, backToUserMenu, confirmCancelKeyboard };
