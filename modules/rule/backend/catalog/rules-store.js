// rules-store.js
// CRUD catalog rule — lưu userData/rules-catalog.json.
// content lưu THẲNG trong JSON (khác skill: rule do user tự viết, không tải
// từ nguồn ngoài nên không cần tách file thật riêng).

const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const FILE = path.join(app.getPath("userData"), "rules-catalog.json");

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
  return Object.values(readAll());
}

function get(id) {
  return readAll()[id] || null;
}

function upsert(rule) {
  const data = readAll();
  const id = rule.id || crypto.randomUUID();
  data[id] = {
    name: "Rule mới",
    content: "",
    agentIds: [],
    pinned: false,
    enabled: true,
    ...data[id],
    ...rule,
    id,
  };
  writeAll(data);
  return data[id];
}

function assignAgents(id, agentIds) {
  const data = readAll();
  if (!data[id]) return null;
  data[id].agentIds = agentIds;
  writeAll(data);
  return data[id];
}

function remove(id) {
  const data = readAll();
  delete data[id];
  writeAll(data);
  return true;
}

function togglePin(id) {
  const data = readAll();
  if (!data[id]) return null;
  data[id].pinned = !data[id].pinned;
  writeAll(data);
  return data[id];
}

function toggleEnabled(id) {
  const data = readAll();
  if (!data[id]) return null;
  data[id].enabled = !data[id].enabled;
  writeAll(data);
  return data[id];
}

function listPinned() {
  return list().filter((r) => r.pinned);
}

module.exports = {
  list,
  get,
  upsert,
  assignAgents,
  remove,
  togglePin,
  toggleEnabled,
  listPinned,
};
