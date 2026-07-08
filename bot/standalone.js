// Botni yakka o'zi ishga tushirish uchun (backend siz).
require('dotenv').config({ path: require('path').resolve(__dirname, '..', 'backend', '.env') });
const path = require('path');

if (!process.env.DATA_DIR) {
  process.env.DATA_DIR = path.resolve(__dirname, '..', 'backend', 'data');
}

const { createBot } = require('./bot');
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("BOT_TOKEN topilmadi. backend/.env faylini tekshiring.");
  process.exit(1);
}
const bot = createBot(token);
bot.launch().then(() => console.log('Bot ishga tushdi (standalone rejim).'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
