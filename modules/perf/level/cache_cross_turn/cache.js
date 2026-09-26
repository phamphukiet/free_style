// cache.js
// Đọc/ghi cache entry trong perf-store riêng, tự giới hạn số lượng + dung lượng.

const store = require("../../backend/store");

const MAX_ENTRIES = 20;
const MAX_RESULT_BYTES = 50 * 1024;

function buildKey(toolName, action, args) {
  return `${toolName}:${action}:${JSON.stringify(args || {})}`;
}

function getEntry(sessionId, toolName, action, args) {
  const cache = store.get(sessionId).cache || {};
  return cache[buildKey(toolName, action, args)] || null;
}

function isTooLarge(result) {
  try {
    return JSON.stringify(result).length > MAX_RESULT_BYTES;
  } catch {
    return true;
  }
}

function evictOldest(cache) {
  const entries = Object.entries(cache);
  if (entries.length <= MAX_ENTRIES) return cache;
  entries.sort((a, b) => a[1].cachedAt - b[1].cachedAt);
  return Object.fromEntries(entries.slice(entries.length - MAX_ENTRIES));
}

function setEntry(sessionId, toolName, action, args, result) {
  if (isTooLarge(result)) return;
  const cache = store.get(sessionId).cache || {};
  const key = buildKey(toolName, action, args);
  const merged = { ...cache, [key]: { result, cachedAt: Date.now() } };
  store.patch(sessionId, { cache: evictOldest(merged) });
}

module.exports = { getEntry, setEntry };
