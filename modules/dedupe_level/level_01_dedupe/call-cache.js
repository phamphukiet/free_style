// call-cache.js
// Cache cấp "1 lượt gọi AI" — sống trong đúng 1 lần handleSend, KHÔNG persist
// qua session. Mỗi lượt tạo cache mới (không phải singleton toàn app).

function createCallCache() {
  const store = new Map();
  const buildKey = (toolName, action, args) =>
    `${toolName}:${action}:${JSON.stringify(args || {})}`;

  return {
    get: (toolName, action, args) =>
      store.get(buildKey(toolName, action, args)),
    set: (toolName, action, args, result) =>
      store.set(buildKey(toolName, action, args), result),
  };
}

module.exports = { createCallCache };
