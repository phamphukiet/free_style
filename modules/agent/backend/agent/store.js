// store.js
// Trách nhiệm duy nhất: đọc/ghi file agents.json trong userData — CRUD thuần,
// không đụng IPC. Model 1 agent: { id, name, providerId, keyId, model }.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { getPreset } = require("./presets/index");
const { setLastUsedPreset } = require("./last-used");

const AGENTS_FILE = path.join(app.getPath("userData"), "agents.json");
const MANAGER_ID = "manager";

function readAll() {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(AGENTS_FILE, "utf-8"));
  } catch {
    data = {};
  }
  return ensureManager(data);
}

function writeAll(data) {
  fs.writeFileSync(AGENTS_FILE, JSON.stringify(data, null, 2), "utf-8");
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
  data[id] = { ...data[id], ...agent, id };
  writeAll(data);
  return data[id];
}

function remove(id) {
  if (id === MANAGER_ID) return false; // không cho xoá agent mặc định
  const data = readAll();
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