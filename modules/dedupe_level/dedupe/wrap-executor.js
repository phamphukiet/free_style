// wrap-executor.js
// Bọc executeToolCall gốc: nếu tool+action cacheable (policy.js) và đã gọi
// với args y hệt trong CÙNG lượt, trả lại kết quả cũ — không I/O thật lần 2.

const { isCacheable } = require("./policy");
const { createCallCache } = require("./call-cache");

function wrapToolExecutor(executeToolCall) {
  const cache = createCallCache();

  return async function executeWithDedupe(toolName, args = {}) {
    const action = args.action;
    if (!isCacheable(toolName, action)) return executeToolCall(toolName, args);

    const hit = cache.get(toolName, action, args);
    if (hit !== undefined) {
      return {
        ...hit,
        _dedupeNote: "Trùng lần gọi trước trong lượt này, không đọc lại.",
      };
    }

    const result = await executeToolCall(toolName, args);
    cache.set(toolName, action, args, result);
    return result;
  };
}

module.exports = { wrapToolExecutor };
