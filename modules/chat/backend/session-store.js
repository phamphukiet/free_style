// session-store.js
// CRUD sessions, mỗi session = 1 file tại <project>/.vibe/session/<id>.json.
// Thuộc về module chat; kanban chỉ gọi qua đây, không tự lưu trữ riêng.
// Chưa mở project -> giữ tạm trong RAM, giống pattern agent/store.js.

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
// const { readState } = require("../../src/main/state");
const { readState } = require("../../../src/main/state");
let memoryStore = {};

function getSessionDir() {
  const { lastFolder } = readState();
  if (!lastFolder || !fs.existsSync(lastFolder)) return null;
  return path.join(lastFolder, ".vibe", "session");
}

function getSessionFile(id) {
  const dir = getSessionDir();
  return dir ? path.join(dir, `${id}.json`) : null;
}

function list() {
  const dir = getSessionDir();
  if (!dir)
    return Object.values(memoryStore).sort((a, b) => b.updatedAt - a.updatedAt);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

function get(id) {
  const file = getSessionFile(id);
  if (!file) return memoryStore[id] || null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return null;
  }
}

function writeOne(session) {
  const file = getSessionFile(session.id);
  if (!file) {
    memoryStore[session.id] = session;
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(session, null, 2), "utf-8");
  delete memoryStore[session.id];
}

function save(session) {
  const id = session.id || crypto.randomUUID();
  const now = Date.now();
  const existing = get(id);
  const next = {
    tokenUsed: 0,
    messages: [],
    ...existing,
    ...session,
    id,
    updatedAt: now,
    createdAt: existing?.createdAt || now,
  };
  writeOne(next);
  return next;
}

function remove(id) {
  const file = getSessionFile(id);
  if (file && fs.existsSync(file)) fs.unlinkSync(file);
  delete memoryStore[id];
  return true;
}

function appendMessage(id, msg, tokenDelta = 0) {
  const session = get(id);
  if (!session) return null;
  session.messages = [...(session.messages || []), msg];
  session.tokenUsed = (session.tokenUsed || 0) + tokenDelta;
  session.updatedAt = Date.now();
  if (!session.title && msg.role === "user") {
    session.title = msg.content.slice(0, 40);
  }
  writeOne(session);
  return session;
}

module.exports = { list, get, save, remove, appendMessage };
