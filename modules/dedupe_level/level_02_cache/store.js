// store.js
// Trách nhiệm duy nhất: CRUD cache thô trên session.toolCache.
// Không quyết định valid/invalid — đó là việc của invalidate.js.

const sessionStore = require("../../chat/backend/session-store");

function buildKey(toolName, action, args) {
  return `${toolName}:${action}:${JSON.stringify(args || {})}`;
}

function getCacheEntry(sessionId, toolName, action, args) {
  if (!sessionId) return null;
  const session = sessionStore.get(sessionId);
  const key = buildKey(toolName, action, args);
  return session?.toolCache?.[key] || null;
}

function setCacheEntry(sessionId, toolName, action, args, result) {
  if (!sessionId) return;
  const session = sessionStore.get(sessionId);
  if (!session) return;
  const key = buildKey(toolName, action, args);
  const toolCache = {
    ...(session.toolCache || {}),
    [key]: { result, cachedAt: Date.now() },
  };
  sessionStore.save({ ...session, toolCache });
}

module.exports = { getCacheEntry, setCacheEntry, buildKey };
