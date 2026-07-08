const fs = require('fs');
const path = require('path');

// DATA_DIR env orqali ma'lumotlar papkasi (backend/data) ni belgilash mumkin.
// Belgilanmagan bo'lsa - shu papkaga nisbatan default (../data) ishlatiladi.
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(__dirname, '..', '..', 'backend', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(fileName) {
  return path.join(DATA_DIR, fileName);
}

function readJSON(fileName, defaultValue = []) {
  try {
    const raw = fs.readFileSync(filePath(fileName), 'utf-8');
    if (!raw.trim()) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return defaultValue;
    console.error(`[db] ${fileName} o'qishda xatolik:`, err.message);
    return defaultValue;
  }
}

function writeJSON(fileName, data) {
  try {
    fs.writeFileSync(filePath(fileName), JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[db] ${fileName} yozishda xatolik:`, err.message);
    return false;
  }
}

function generateId() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

module.exports = { readJSON, writeJSON, generateId, DATA_DIR };
