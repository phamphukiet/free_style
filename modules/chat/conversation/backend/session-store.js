// session-store.js
// CRUD sessions lưu trong userData/chat-sessions.json.
// Mỗi session: { id, agentId, title, messages[], tokenUsed, createdAt, updatedAt }

const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const FILE = path.join(app.getPath("userData"), "chat-sessions.json");

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

function list() {
  const data = readAll();
  return Object.values(data).sort((a, b) => b.updatedAt - a.updatedAt);
}

function get(id) {
  return readAll()[id] || null;
}

function save(session) {
  const data = readAll();
  const id = session.id || crypto.randomUUID();
  const now = Date.now();
  data[id] = {
    tokenUsed: 0,
    messages: [],
    ...data[id],
    ...session,
    id,
    updatedAt: now,
    createdAt: data[id]?.createdAt || now,
  };
  writeAll(data);
  return data[id];
}

function remove(id) {
  const data = readAll();
  delete data[id];
  writeAll(data);
  return true;
}

function appendMessage(id, msg, tokenDelta = 0) {
  const data = readAll();
  if (!data[id]) return null;
  data[id].messages = [...(data[id].messages || []), msg];
  data[id].tokenUsed = (data[id].tokenUsed || 0) + tokenDelta;
  data[id].updatedAt = Date.now();
  if (!data[id].title && msg.role === "user") {
    data[id].title = msg.content.slice(0, 40);
  }
  writeAll(data);
  return data[id];
}

module.exports = { list, get, save, remove, appendMessage };
