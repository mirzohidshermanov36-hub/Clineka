const { Markup } = require('telegraf');
const { isAdmin } = require('../utils/auth');
const { readJSON, writeJSON, generateId } = require('../utils/db');
const { getState, setState, updateState, clearState } = require('../utils/state');
const {
  servicesMenu,
  cancelKeyboard,
  skipImageKeyboard,
  deleteListKeyboard,
  editListKeyboard,
} = require('../keyboards/adminKeyboards');

const FILE = 'services.json';

function registerServiceHandlers(bot) {
  // Bo'lim menyusi
  bot.action('admin_services', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    clearState(ctx.from.id);
    await ctx.answerCbQuery();
    await ctx.editMessageText('📋 <b>Xizmatlar bo\'limi</b>', {
      parse_mode: 'HTML',
      ...servicesMenu(),
    }).catch(() => ctx.reply('📋 <b>Xizmatlar bo\'limi</b>', { parse_mode: 'HTML', ...servicesMenu() }));
  });

  // Barcha xizmatlar
  bot.action('service_list', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    const services = readJSON(FILE, []);
    if (services.length === 0) {
      return ctx.reply('📋 Hozircha xizmatlar mavjud emas.');
    }
    for (const s of services) {
      const caption = `📋 <b>${s.name}</b>\n\n${s.description}`;
      if (s.image) {
        await ctx.replyWithPhoto(s.image, { caption, parse_mode: 'HTML' }).catch(() => ctx.reply(caption, { parse_mode: 'HTML' }));
      } else {
        await ctx.reply(caption, { parse_mode: 'HTML' });
      }
    }
  });

  // Qo'shish - boshlash
  bot.action('service_add', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    setState(ctx.from.id, { action: 'add_service', step: 'name', data: {} });
    await ctx.reply('➕ Yangi xizmat nomini kiriting:', cancelKeyboard());
  });

  // O'chirish ro'yxati
  bot.action('service_delete_list', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    const services = readJSON(FILE, []);
    if (services.length === 0) return ctx.reply('📋 Xizmatlar ro\'yxati bo\'sh.');
    await ctx.reply('🗑 O\'chirish uchun xizmatni tanlang:', deleteListKeyboard(services, 'service_del'));
  });

  bot.action(/^service_del_(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    const id = ctx.match[1];
    const services = readJSON(FILE, []);
    const next = services.filter((s) => s.id !== id);
    writeJSON(FILE, next);
    await ctx.answerCbQuery('O\'chirildi ✅');
    await ctx.editMessageText('🗑 Xizmat o\'chirildi.').catch(() => {});
  });

  // Tahrirlash ro'yxati
  bot.action('service_edit_list', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    const services = readJSON(FILE, []);
    if (services.length === 0) return ctx.reply('📋 Xizmatlar ro\'yxati bo\'sh.');
    await ctx.reply('✏️ Tahrirlash uchun xizmatni tanlang:', editListKeyboard(services, 'service_edit'));
  });

  bot.action(/^service_edit_(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    const id = ctx.match[1];
    const services = readJSON(FILE, []);
    const service = services.find((s) => s.id === id);
    if (!service) return ctx.answerCbQuery('Topilmadi');
    await ctx.answerCbQuery();
    setState(ctx.from.id, { action: 'edit_service', step: 'name', data: { id } });
    await ctx.reply(
      `✏️ Joriy nomi: <b>${service.name}</b>\n\nYangi nomini kiriting (o'zgartirmaslik uchun "-" yuboring):`,
      { parse_mode: 'HTML', ...cancelKeyboard() }
    );
  });

  bot.action('service_skip_image', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return ctx.answerCbQuery();
    const state = getState(ctx.from.id);
    if (!state || state.action !== 'add_service' || state.step !== 'image') return ctx.answerCbQuery();
    const services = readJSON(FILE, []);
    const newService = { id: generateId(), name: state.data.name, description: state.data.description, image: '', createdAt: new Date().toISOString() };
    services.push(newService);
    writeJSON(FILE, services);
    clearState(ctx.from.id);
    await ctx.answerCbQuery('Saqlandi ✅');
    await ctx.editMessageText("✅ Yangi xizmat qo'shildi (rasmsiz)!").catch(() => {});
    await ctx.reply("📋 Xizmatlar bo'limi", servicesMenu());
  });

  // Matnli qadamlar (add/edit)
  async function handleText(ctx, state) {
    const { action, step, data } = state;
    const text = ctx.message.text.trim();

    if (action === 'add_service') {
      if (step === 'name') {
        updateState(ctx.from.id, { step: 'description', data: { ...data, name: text } });
        return ctx.reply('📝 Endi xizmat tavsifini kiriting:', cancelKeyboard());
      }
      if (step === 'description') {
        updateState(ctx.from.id, { step: 'image', data: { ...data, description: text } });
        return ctx.reply(
          '🖼 Endi xizmat uchun rasm yuboring (ixtiyoriy).\nRasmsiz saqlash uchun pastdagi tugmani bosing yoki "-" deb yozing:',
          skipImageKeyboard()
        );
      }
      if (step === 'image' && (text === '-' || text.trim().toLowerCase() === "o'tkazib yuborish")) {
        const services = readJSON(FILE, []);
        const newService = { id: generateId(), name: data.name, description: data.description, image: '', createdAt: new Date().toISOString() };
        services.push(newService);
        writeJSON(FILE, services);
        clearState(ctx.from.id);
        return ctx.reply("✅ Yangi xizmat qo'shildi (rasmsiz)!", servicesMenu());
      }
    }

    if (action === 'edit_service') {
      const services = readJSON(FILE, []);
      const idx = services.findIndex((s) => s.id === data.id);
      if (idx === -1) {
        clearState(ctx.from.id);
        return ctx.reply('❌ Xizmat topilmadi.');
      }
      if (step === 'name') {
        if (text !== '-') services[idx].name = text;
        writeJSON(FILE, services);
        updateState(ctx.from.id, { step: 'description' });
        return ctx.reply(
          `📝 Joriy tavsif: ${services[idx].description}\n\nYangi tavsifni kiriting (o'zgarmasin desangiz "-" yuboring):`,
          cancelKeyboard()
        );
      }
      if (step === 'description') {
        if (text !== '-') services[idx].description = text;
        writeJSON(FILE, services);
        updateState(ctx.from.id, { step: 'image' });
        return ctx.reply('🖼 Yangi rasm yuboring (o\'zgarmasin desangiz "-" deb yozing):', cancelKeyboard());
      }
      if (step === 'image' && text === '-') {
        clearState(ctx.from.id);
        return ctx.reply('✅ Xizmat muvaffaqiyatli tahrirlandi.', servicesMenu());
      }
    }
  }

  // Rasm qadamlari (add/edit)
  async function handlePhoto(ctx, state) {
    const { action, step, data } = state;
    if (step !== 'image') return;
    const photos = ctx.message.photo;
    const fileId = photos[photos.length - 1].file_id;

    if (action === 'add_service') {
      const services = readJSON(FILE, []);
      const newService = { id: generateId(), name: data.name, description: data.description, image: fileId, createdAt: new Date().toISOString() };
      services.push(newService);
      writeJSON(FILE, services);
      clearState(ctx.from.id);
      return ctx.reply('✅ Yangi xizmat qo\'shildi!', servicesMenu());
    }

    if (action === 'edit_service') {
      const services = readJSON(FILE, []);
      const idx = services.findIndex((s) => s.id === data.id);
      if (idx !== -1) {
        services[idx].image = fileId;
        writeJSON(FILE, services);
      }
      clearState(ctx.from.id);
      return ctx.reply('✅ Xizmat muvaffaqiyatli tahrirlandi.', servicesMenu());
    }
  }

  return { handleText, handlePhoto };
}

module.exports = registerServiceHandlers;
