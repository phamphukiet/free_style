// store.js
// Đọc/ghi todo list gắn theo sessionId. Tái dùng chat/session-store.js —
// todo là 1 field trong session, không cần file lưu trữ riêng.

const sessionStore = require("../../chat/backend/session-store");

function getList(sessionId) {
  if (!sessionId) return [];
  return sessionStore.get(sessionId)?.todos || [];
}

function saveList(sessionId, items) {
  if (!sessionId) throw new Error("Thiếu sessionId.");
  const session = sessionStore.get(sessionId);
  if (!session) throw new Error("Session không tồn tại.");
  sessionStore.save({ ...session, todos: items });
  return items;
}

module.exports = { getList, saveList };