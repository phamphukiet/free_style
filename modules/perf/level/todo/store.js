// store.js
// Đọc/ghi todo list theo sessionId trong perf-store riêng —
// KHÔNG còn nhét vào session.todos của chat (gỡ phụ thuộc + hết phình session).

const store = require("../../backend/store");

function getList(sessionId) {
  if (!sessionId) return [];
  return store.get(sessionId).todos || [];
}

function saveList(sessionId, items) {
  if (!sessionId) throw new Error("Thiếu sessionId.");
  store.patch(sessionId, { todos: items });
  return items;
}

module.exports = { getList, saveList };
