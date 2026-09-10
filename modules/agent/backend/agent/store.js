// store.js
// Trách nhiệm duy nhất: đọc/ghi file agents.json trong userData — CRUD thuần,
// không đụng IPC. Model 1 agent: { id, name, providerId, keyId, model }.

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { readState } = require("../../../../src/main/state");
const MANAGER_ID = "manager";
const AGENTS_DIR = ".vibe";
const AGENTS_FILENAME = "agent.json";

function getAgentsFile() {
  const { lastFolder } = readState();
  if (!lastFolder) return null;
  return path.join(lastFolder, AGENTS_DIR, AGENTS_FILENAME);
}

function readAll() {
  const file = getAgentsFile();
  if (!file) return ensureManager({}); // chưa mở project — vẫn có Manager mặc định, không ghi file
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    data = {};
  }
  return ensureManager(data);
}

function writeAll(data) {
  const file = getAgentsFile();
  if (!file) return;
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[agent/store] writeAll lỗi:", err);
    throw err;
  }
}

function list() {
  return Object.values(readAll());
}

function get(id) {
  return readAll()[id] || null;
}

function save(agent) {
  const data = readAll();
  const id = agent.id || crypto.randomUUID();
  const name = id === MANAGER_ID ? "Manager" : agent.name || data[id]?.name;
  data[id] = { ...data[id], ...agent, id, name };
  writeAll(data);
  return data[id];
}

function remove(id) {
  if (id === MANAGER_ID) return false;
  const data = readAll();
  if (!data[id]) return false;
  delete data[id];
  writeAll(data);
  return true;
}

function ensureManager(data) {
  if (!data[MANAGER_ID]) {
    data[MANAGER_ID] = {
      id: MANAGER_ID,
      name: "Manager",
      providerId: "",
      keyId: "",
      model: "",
    };
    writeAll(data);
  }
  return data;
}

module.exports = { list, get, save, remove, MANAGER_ID };