const adminIds = (process.env.ADMIN_IDS || '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

/** Berilgan Telegram foydalanuvchi ID si admin ekanligini tekshiradi */
function isAdmin(userId) {
  return adminIds.includes(String(userId));
}

module.exports = { isAdmin, adminIds };
