// store.js
// Storage RIÊNG của perf — hoàn toàn tách khỏi chat-sessions.json.
// Mỗi sessionId có 1 record TTL riêng, tự dọn khi hết hạn, không phình vô hạn.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const FILE = path.join(app.getPath("userData"), "perf-store.json");
const TTL_MS = 30 * 60 * 1000;

function readAll() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeAll(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

function prune(data) {
  const now = Date.now();
  for (const id in data) {
    if (now - (data[id].updatedAt || 0) > TTL_MS) delete data[id];
  }
  return data;
}

function get(sessionId) {
  if (!sessionId) return {};
  return prune(readAll())[sessionId] || {};
}

// partial: merge nông ở cấp field top-level (cache/dirty/todos...).
function patch(sessionId, partial) {
  if (!sessionId) return;
  const data = prune(readAll());
  data[sessionId] = {
    ...(data[sessionId] || {}),
    ...partial,
    updatedAt: Date.now(),
  };
  writeAll(data);
}

function clear(sessionId) {
  const data = readAll();
  delete data[sessionId];
  writeAll(data);
}

module.exports = { get, patch, clear };
