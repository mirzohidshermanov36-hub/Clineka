// Har bir foydalanuvchining "hozir nima kutilyapti" holatini xotirada saqlaymiz.
// Masalan: { action: 'add_service', step: 'name', data: {} }
const sessions = new Map();

function getState(userId) {
  return sessions.get(String(userId)) || null;
}

function setState(userId, state) {
  sessions.set(String(userId), state);
}

function updateState(userId, patch) {
  const current = getState(userId) || {};
  setState(userId, { ...current, ...patch });
}

function clearState(userId) {
  sessions.delete(String(userId));
}

module.exports = { getState, setState, updateState, clearState };
