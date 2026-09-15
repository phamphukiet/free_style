// store.js
const sessionStore = require("../../chat/backend/session-store");

const MAX_ENTRIES = 20;
const MAX_RESULT_BYTES = 50 * 1024;

function buildKey(toolName, action, args) {
  return `${toolName}:${action}:${JSON.stringify(args || {})}`;
}

function getCacheEntry(sessionId, toolName, action, args) {
  if (!sessionId) return null;
  const session = sessionStore.get(sessionId);
  const key = buildKey(toolName, action, args);
  return session?.toolCache?.[key] || null;
}

function isTooLarge(result) {
  try {
    return JSON.stringify(result).length > MAX_RESULT_BYTES;
  } catch {
    return true;
  }
}

function evictOldest(toolCache) {
  const entries = Object.entries(toolCache);
  if (entries.length <= MAX_ENTRIES) return toolCache;
  entries.sort((a, b) => a[1].cachedAt - b[1].cachedAt);
  return Object.fromEntries(entries.slice(entries.length - MAX_ENTRIES));
}

function setCacheEntry(sessionId, toolName, action, args, result) {
  if (!sessionId || isTooLarge(result)) return;
  const session = sessionStore.get(sessionId);
  if (!session) return;
  const key = buildKey(toolName, action, args);
  const merged = {
    ...(session.toolCache || {}),
    [key]: { result, cachedAt: Date.now() },
  };
  sessionStore.save({ ...session, toolCache: evictOldest(merged) });
}

module.exports = { getCacheEntry, setCacheEntry, buildKey };