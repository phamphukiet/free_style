// store.js
// Trách nhiệm duy nhất: CRUD session chat trong userData — không đụng IPC.
// Session: { id, title, agentId, messages, tokenUsed, lastToolUsed, updatedAt }

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
  return Object.values(readAll()).sort(
    (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
  );
}

function get(id) {
  return readAll()[id] || null;
}

function save(session) {
  const data = readAll();
  const id = session.id || crypto.randomUUID();
  data[id] = {
    messages: [],
    tokenUsed: 0,
    ...data[id],
    ...session,
    id,
    updatedAt: Date.now(),
  };
  writeAll(data);
  return data[id];
}

function remove(id) {
  const data = readAll();
  if (!data[id]) return false;
  delete data[id];
  writeAll(data);
  return true;
}

function appendMessage(id, message, tokenUsed = 0) {
  const data = readAll();
  const session = data[id];
  if (!session) return null;
  session.messages = [...(session.messages || []), message];
  session.tokenUsed = (session.tokenUsed || 0) + tokenUsed;
  session.updatedAt = Date.now();
  writeAll(data);
  return session;
}

function setLastTool(id, toolId) {
  const data = readAll();
  const session = data[id];
  if (!session) return null;
  session.lastToolUsed = toolId;
  writeAll(data);
  return session;
}

module.exports = { list, get, save, remove, appendMessage, setLastTool };
