// wrap.js
// Cache trong đúng 1 lượt handleSend — sống bằng closure, KHÔNG persist,
// không cần sessionId, không đụng gì ngoài executeToolCall truyền vào.

const { isCacheable } = require("./policy");

function buildKey(toolName, action, args) {
  return `${toolName}:${action}:${JSON.stringify(args || {})}`;
}

function wrap(executeToolCall) {
  const cache = new Map();

  return async function executeWithDedupe(toolName, args = {}) {
    const action = args.action;
    if (!isCacheable(toolName, action)) return executeToolCall(toolName, args);

    const key = buildKey(toolName, action, args);
    if (cache.has(key)) {
      return {
        ...cache.get(key),
        _dedupeNote: "Trùng lần gọi trước trong lượt này, không đọc lại.",
      };
    }

    const result = await executeToolCall(toolName, args);
    cache.set(key, result);
    return result;
  };
}

module.exports = { wrap };
