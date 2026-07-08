const { isAdmin } = require('../utils/auth');
const { readJSON, writeJSON, generateId } = require('../utils/db');
const { setState, updateState, clearState } = require('../utils/state');
const { certificatesMenu, cancelKeyboard, deleteListKeyboard } = require('../keyboards/adminKeyboards');

const FILE = 'certificates.json';

function registerCertificateHandlers(bot) {
  bot.action('admin_certificates', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    clearState(ctx.from.id);
    await ctx.answerCbQuery();
    await ctx.editMessageText('📜 <b>Sertifikatlar bo\'limi</b>', {
      parse_mode: 'HTML',
      ...certificatesMenu(),
    }).catch(() => ctx.reply('📜 <b>Sertifikatlar bo\'limi</b>', { parse_mode: 'HTML', ...certificatesMenu() }));
  });

  bot.action('cert_list', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    const certs = readJSON(FILE, []);
    if (certs.length === 0) return ctx.reply('📜 Hozircha sertifikatlar mavjud emas.');
    for (const c of certs) {
      const caption = `📜 <b>${c.name}</b>\n🗓 ${c.year}-yil`;
      await ctx.replyWithPhoto(c.image, { caption, parse_mode: 'HTML' }).catch(() => ctx.reply(caption, { parse_mode: 'HTML' }));
    }
  });

  bot.action('cert_add', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    setState(ctx.from.id, { action: 'add_cert', step: 'name', data: {} });
    await ctx.reply('➕ Sertifikat nomini kiriting:', cancelKeyboard());
  });

  bot.action('cert_delete_list', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    const certs = readJSON(FILE, []);
    if (certs.length === 0) return ctx.reply('📜 Sertifikatlar ro\'yxati bo\'sh.');
    await ctx.reply('🗑 O\'chirish uchun sertifikatni tanlang:', deleteListKeyboard(certs, 'cert_del'));
  });

  bot.action(/^cert_del_(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    const id = ctx.match[1];
    const certs = readJSON(FILE, []);
    writeJSON(FILE, certs.filter((c) => c.id !== id));
    await ctx.answerCbQuery('O\'chirildi ✅');
    await ctx.editMessageText('🗑 Sertifikat o\'chirildi.').catch(() => {});
  });

  async function handleText(ctx, state) {
    const { action, step, data } = state;
    const text = ctx.message.text.trim();
    if (action !== 'add_cert') return;
    if (step === 'name') {
      updateState(ctx.from.id, { step: 'year', data: { ...data, name: text } });
      return ctx.reply('🗓 Sertifikat yilini kiriting (masalan: 2024):', cancelKeyboard());
    }
    if (step === 'year') {
      updateState(ctx.from.id, { step: 'image', data: { ...data, year: text } });
      return ctx.reply('🖼 Endi sertifikat rasmini yuboring:', cancelKeyboard());
    }
  }

  async function handlePhoto(ctx, state) {
    const { action, step, data } = state;
    if (action !== 'add_cert' || step !== 'image') return;
    const photos = ctx.message.photo;
    const fileId = photos[photos.length - 1].file_id;
    const certs = readJSON(FILE, []);
    certs.push({ id: generateId(), name: data.name, year: data.year, image: fileId, createdAt: new Date().toISOString() });
    writeJSON(FILE, certs);
    clearState(ctx.from.id);
    return ctx.reply('✅ Yangi sertifikat qo\'shildi!', certificatesMenu());
  }

  return { handleText, handlePhoto };
}

module.exports = registerCertificateHandlers;
