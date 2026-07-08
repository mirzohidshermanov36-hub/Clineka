const { isAdmin } = require('../utils/auth');
const { readJSON, writeJSON, generateId } = require('../utils/db');
const { setState, updateState, clearState } = require('../utils/state');
const { videosMenu, cancelKeyboard, deleteListKeyboard } = require('../keyboards/adminKeyboards');

const FILE = 'videos.json';

function registerVideoHandlers(bot) {
  bot.action('admin_videos', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    clearState(ctx.from.id);
    await ctx.answerCbQuery();
    await ctx.editMessageText('🎥 <b>Natijalar bo\'limi</b>', {
      parse_mode: 'HTML',
      ...videosMenu(),
    }).catch(() => ctx.reply('🎥 <b>Natijalar bo\'limi</b>', { parse_mode: 'HTML', ...videosMenu() }));
  });

  bot.action('video_list', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    const videos = readJSON(FILE, []);
    if (videos.length === 0) return ctx.reply('🎥 Hozircha videolar mavjud emas.');
    for (const v of videos) {
      const caption = `🎥 <b>${v.name}</b>\n\n${v.description}`;
      await ctx.replyWithVideo(v.fileId, { caption, parse_mode: 'HTML' }).catch(() => ctx.reply(caption, { parse_mode: 'HTML' }));
    }
  });

  bot.action('video_add', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    setState(ctx.from.id, { action: 'add_video', step: 'name', data: {} });
    await ctx.reply('➕ Video uchun nom kiriting:', cancelKeyboard());
  });

  bot.action('video_delete_list', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    const videos = readJSON(FILE, []);
    if (videos.length === 0) return ctx.reply('🎥 Videolar ro\'yxati bo\'sh.');
    await ctx.reply('🗑 O\'chirish uchun videoni tanlang:', deleteListKeyboard(videos, 'video_del'));
  });

  bot.action(/^video_del_(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    const id = ctx.match[1];
    const videos = readJSON(FILE, []);
    writeJSON(FILE, videos.filter((v) => v.id !== id));
    await ctx.answerCbQuery('O\'chirildi ✅');
    await ctx.editMessageText('🗑 Video o\'chirildi.').catch(() => {});
  });

  async function handleText(ctx, state) {
    const { action, step, data } = state;
    const text = ctx.message.text.trim();
    if (action !== 'add_video') return;
    if (step === 'name') {
      updateState(ctx.from.id, { step: 'description', data: { ...data, name: text } });
      return ctx.reply('📝 Video uchun tavsif kiriting:', cancelKeyboard());
    }
    if (step === 'description') {
      updateState(ctx.from.id, { step: 'video', data: { ...data, description: text } });
      return ctx.reply('🎥 Endi video faylini yuboring:', cancelKeyboard());
    }
  }

  async function handleVideo(ctx, state) {
    const { action, step, data } = state;
    if (action !== 'add_video' || step !== 'video') return;
    const fileId = ctx.message.video.file_id;
    const videos = readJSON(FILE, []);
    videos.push({ id: generateId(), name: data.name, description: data.description, fileId, createdAt: new Date().toISOString() });
    writeJSON(FILE, videos);
    clearState(ctx.from.id);
    return ctx.reply('✅ Yangi video qo\'shildi!', videosMenu());
  }

  return { handleText, handleVideo };
}

module.exports = registerVideoHandlers;
