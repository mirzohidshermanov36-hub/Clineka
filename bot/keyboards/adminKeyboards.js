const { Markup } = require('telegraf');

const adminMainMenu = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('📋 Xizmatlar', 'admin_services')],
    [Markup.button.callback('🎥 Natijalar', 'admin_videos')],
    [Markup.button.callback('📜 Sertifikatlar', 'admin_certificates')],
    [Markup.button.callback('📅 Qabulga yozilgan mijozlar', 'admin_appointments')],
  ]);

const backButton = (action = 'admin_home') =>
  Markup.inlineKeyboard([[Markup.button.callback('🔙 Orqaga', action)]]);

const servicesMenu = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('➕ Xizmat qo\'shish', 'service_add')],
    [Markup.button.callback('🗑 Xizmatni o\'chirish', 'service_delete_list')],
    [Markup.button.callback('📋 Barcha xizmatlar', 'service_list')],
    [Markup.button.callback('🔙 Orqaga', 'admin_home')],
  ]);

const videosMenu = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('➕ Natija qo\'shish (video + matn)', 'video_add')],
    [Markup.button.callback('🗑 Natijani o\'chirish', 'video_delete_list')],
    [Markup.button.callback('📋 Barcha natijalar', 'video_list')],
    [Markup.button.callback('🔙 Orqaga', 'admin_home')],
  ]);

const certificatesMenu = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('➕ Sertifikat qo\'shish (rasm + matn)', 'cert_add')],
    [Markup.button.callback('🗑 Sertifikatni o\'chirish', 'cert_delete_list')],
    [Markup.button.callback('📋 Barcha sertifikatlar', 'cert_list')],
    [Markup.button.callback('🔙 Orqaga', 'admin_home')],
  ]);

const cancelKeyboard = () =>
  Markup.inlineKeyboard([[Markup.button.callback('❌ Bekor qilish', 'flow_cancel')]]);

const skipImageKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('⏭ Rasmsiz saqlash', 'service_skip_image')],
    [Markup.button.callback('❌ Bekor qilish', 'flow_cancel')],
  ]);

const deleteListKeyboard = (items, prefix) =>
  Markup.inlineKeyboard([
    ...items.map((it) => [Markup.button.callback(`🗑 ${it.name}`, `${prefix}_${it.id}`)]),
    [Markup.button.callback('🔙 Orqaga', 'admin_home')],
  ]);

const editListKeyboard = (items, prefix) =>
  Markup.inlineKeyboard([
    ...items.map((it) => [Markup.button.callback(`✏️ ${it.name}`, `${prefix}_${it.id}`)]),
    [Markup.button.callback('🔙 Orqaga', 'admin_home')],
  ]);

module.exports = {
  adminMainMenu,
  backButton,
  servicesMenu,
  videosMenu,
  certificatesMenu,
  cancelKeyboard,
  skipImageKeyboard,
  deleteListKeyboard,
  editListKeyboard,
};
