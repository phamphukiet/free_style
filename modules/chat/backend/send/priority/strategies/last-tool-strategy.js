// last-tool-strategy.js
// Ưu tiên tool dùng gần nhất trong session, khi không có @mention.
// Ghi lastToolUsed sau khi có tool thực sự được gọi.

const { registerStrategy } = require("../strategy-registry.js");
const sessionStore = require("../../../session-store.js");

function resolve({ sessionId }) {
  if (!sessionId) return null;
  const lastToolUsed = sessionStore.get(sessionId)?.lastToolUsed;
  if (!lastToolUsed) return null;
  return { priorityNames: [lastToolUsed] };
}

function commit({ sessionId, calledTools }) {
  if (!sessionId || calledTools.length === 0) return;
  sessionStore.setLastTool(sessionId, calledTools[calledTools.length - 1]);
}

registerStrategy("last-tool", { resolve, commit, order: 10 });
