// wrap-executor.js
// Bọc executeToolCall: cache XUYÊN TURN theo sessionId (khác level_01_dedupe chỉ
// sống trong 1 turn). Tự invalidate khi gặp files:write/move/delete.

const { isCacheable, isMutating } = require("./policy");
const { getCacheEntry, setCacheEntry } = require("./store");
const {
  isValid,
  markTreeDirty,
  markPathDirty,
  clearTreeDirty,
  clearPathDirty,
} = require("./invalidate");

function wrapToolExecutor(executeToolCall, sessionId) {
    return async function executeWithCache(toolName, args = {}) {
      const action = args.action;
      if (!sessionId) return executeToolCall(toolName, args);
      if (isMutating(toolName, action)) {
        console.log(
          `[level_02_cache] MUTATE ${toolName}:${action} — đánh dấu dirty`,
        );
        const result = await executeToolCall(toolName, args);
        markTreeDirty(sessionId);
        if (args.path) markPathDirty(sessionId, args.path);
        return result;
      }

      if (!isCacheable(toolName, action))
        return executeToolCall(toolName, args);

      const cached = getCacheEntry(sessionId, toolName, action, args);
      if (cached && isValid(sessionId, toolName, action, args)) {
        console.log(`[level_02_cache] HIT (xuyên turn) ${toolName}:${action}`);
        return {
          ...cached.result,
          _cacheNote:
            "Dùng lại kết quả đã đọc trước đó (cache xuyên turn), không đọc lại.",
        };
      }

      console.log(
        `[level_02_cache] MISS ${toolName}:${action} — gọi thật + lưu cache`,
      );
      const result = await executeToolCall(toolName, args);
      setCacheEntry(sessionId, toolName, action, args, result);
      if (action === "tree") clearTreeDirty(sessionId);
      if (action === "read" && args.path) clearPathDirty(sessionId, args.path);
      return result;
    };
}

module.exports = { wrapToolExecutor };
