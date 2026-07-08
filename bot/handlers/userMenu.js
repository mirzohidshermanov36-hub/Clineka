const { readJSON } = require('../utils/db');
const { backToUserMenu } = require('../keyboards/userKeyboards');

function registerUserMenuHandlers(bot) {
  bot.action('user_services', async (ctx) => {
    await ctx.answerCbQuery();
    const services = readJSON('services.json', []);
    if (services.length === 0) {
      return ctx.reply('📋 Hozircha xizmatlar qo\'shilmagan.', backToUserMenu());
    }
    for (const s of services) {
      const caption = `📋 <b>${s.name}</b>\n\n${s.description}`;
      if (s.image) {
        await ctx.replyWithPhoto(s.image, { caption, parse_mode: 'HTML' }).catch(() => ctx.reply(caption, { parse_mode: 'HTML' }));
      } else {
        await ctx.reply(caption, { parse_mode: 'HTML' });
      }
    }
    await ctx.reply('👆 Barcha xizmatlarimiz shu yerda.', backToUserMenu());
  });

  bot.action('user_videos', async (ctx) => {
    await ctx.answerCbQuery();
    const videos = readJSON('videos.json', []);
    if (videos.length === 0) {
      return ctx.reply('🎥 Hozircha videolar qo\'shilmagan.', backToUserMenu());
    }
    for (const v of videos) {
      const caption = `🎥 <b>${v.name}</b>\n\n${v.description}`;
      await ctx.replyWithVideo(v.fileId, { caption, parse_mode: 'HTML' }).catch(() => ctx.reply(caption, { parse_mode: 'HTML' }));
    }
    await ctx.reply('👆 Bemorlarimizning natijalari.', backToUserMenu());
  });

  bot.action('user_contact', async (ctx) => {
    await ctx.answerCbQuery();
    const settings = readJSON('settings.json', {});
    const text =
      `📞 <b>Bog'lanish</b>\n\n` +
      `🏥 ${settings.clinicName || 'Bekzod Abdiyev'}\n` +
      `📍 ${settings.address || '—'}\n` +
      `☎️ ${settings.phone || '—'}\n` +
      (settings.telegram ? `✈️ ${settings.telegram}` : '');
    await ctx.reply(text, { parse_mode: 'HTML', ...backToUserMenu() });
  });
}

module.exports = registerUserMenuHandlers;
