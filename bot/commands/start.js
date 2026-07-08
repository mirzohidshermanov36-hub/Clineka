const { isAdmin } = require('../utils/auth');
const { adminMainMenu } = require('../keyboards/adminKeyboards');
const { userMainMenu } = require('../keyboards/userKeyboards');
const { clearState } = require('../utils/state');

function registerStartCommand(bot) {
  bot.start(async (ctx) => {
    clearState(ctx.from.id);
    if (isAdmin(ctx.from.id)) {
      await ctx.reply(
        '🏥 <b>Bekzod Abdiyev Admin Panel</b>\n\nKerakli bo\'limni tanlang:',
        { parse_mode: 'HTML', ...adminMainMenu() }
      );
    } else {
      await ctx.reply(
        '🏥 <b>Bekzod Abdiyev</b>\n<i>Bolalar urologi</i>\n\nAssalomu alaykum! Botdan kerakli bo\'limni tanlang 👇',
        { parse_mode: 'HTML', ...userMainMenu() }
      );
    }
  });

  // Admin har doim /admin buyrug'i orqali panelga qaytishi mumkin
  bot.command('admin', async (ctx) => {
    if (!isAdmin(ctx.from.id)) {
      return ctx.reply('⛔ Sizda admin panelga kirish huquqi yo\'q.');
    }
    clearState(ctx.from.id);
    await ctx.reply('🏥 <b>Bekzod Abdiyev Admin Panel</b>', {
      parse_mode: 'HTML',
      ...adminMainMenu(),
    });
  });

  // "🔙 Orqaga" -> admin bosh menyu
  bot.action('admin_home', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    clearState(ctx.from.id);
    await ctx.answerCbQuery();
    await ctx.editMessageText('🏥 <b>Bekzod Abdiyev Admin Panel</b>', {
      parse_mode: 'HTML',
      ...adminMainMenu(),
    }).catch(() => ctx.reply('🏥 <b>Bekzod Abdiyev Admin Panel</b>', { parse_mode: 'HTML', ...adminMainMenu() }));
  });

  // "🔙 Bosh menyu" -> oddiy foydalanuvchi menyusi
  bot.action('user_home', async (ctx) => {
    clearState(ctx.from.id);
    await ctx.answerCbQuery();
    await ctx.editMessageText('🏥 <b>Bekzod Abdiyev</b>\n<i>Bolalar urologi</i>', {
      parse_mode: 'HTML',
      ...userMainMenu(),
    }).catch(() => ctx.reply('🏥 <b>Bekzod Abdiyev</b>', { parse_mode: 'HTML', ...userMainMenu() }));
  });
}

module.exports = registerStartCommand;
