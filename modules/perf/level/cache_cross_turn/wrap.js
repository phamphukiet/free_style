// wrap.js
// Bọc executeToolCall: cache XUYÊN TURN theo sessionId, tự invalidate khi
// gặp files:write/move/delete. Toàn bộ state nằm ở perf-store.json riêng.

const { isCacheable, isMutating } = require("./policy");
const { getEntry, setEntry } = require("./cache");
const {
  isValid,
  markTreeDirty,
  markPathDirty,
  clearTreeDirty,
  clearPathDirty,
} = require("./invalidate");

function wrap(executeToolCall, sessionId) {
  return async function executeWithCache(toolName, args = {}) {
    const action = args.action;
    if (!sessionId) return executeToolCall(toolName, args);

    if (isMutating(toolName, action)) {
      const result = await executeToolCall(toolName, args);
      markTreeDirty(sessionId);
      if (args.path) markPathDirty(sessionId, args.path);
      return result;
    }

    if (!isCacheable(toolName, action)) return executeToolCall(toolName, args);

    const cached = getEntry(sessionId, toolName, action, args);
    if (cached && isValid(sessionId, toolName, action, args)) {
      return {
        ...cached.result,
        _cacheNote:
          "Dùng lại kết quả đã đọc trước đó (cache xuyên turn), không đọc lại.",
      };
    }

    const result = await executeToolCall(toolName, args);
    setEntry(sessionId, toolName, action, args, result);
    if (action === "tree") clearTreeDirty(sessionId);
    if (action === "read" && args.path) clearPathDirty(sessionId, args.path);
    return result;
  };
}

module.exports = { wrap };
