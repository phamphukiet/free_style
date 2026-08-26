// platforms-store.js
// CRUD platform. Platform mặc định (GitHub) tự seed nếu thiếu, không cho xoá
// — giống pattern ensureManager()/MANAGER_ID ở agent/store.js.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const { getAdapter, DEFAULT_PLATFORM_IDS } = require("./platforms");

const FILE = path.join(app.getPath("userData"), "skill-platforms.json");

function readRaw() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeAll(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

function ensureDefaults(data) {
  let changed = false;
  for (const id of DEFAULT_PLATFORM_IDS) {
    if (!data[id]) {
      const adapter = getAdapter(id);
      if (adapter) {
        data[id] = { ...adapter.definition };
        changed = true;
      }
    }
  }
  if (changed) writeAll(data);
  return data;
}

function readAll() {
  return ensureDefaults(readRaw());
}

function list() {
  return Object.values(readAll());
}

function findByEndpoint(endpoint) {
  return list().find((p) => p.endpoint === endpoint) || null;
}

function save(platform) {
  const data = readAll();
  const id = platform.id || `pf_${Date.now()}`;
  data[id] = { ...data[id], ...platform, id };
  writeAll(data);
  return data[id];
}

function remove(id) {
  if (DEFAULT_PLATFORM_IDS.includes(id)) return false; // GitHub không cho xoá
  const data = readAll();
  delete data[id];
  writeAll(data);
  return true;
}

module.exports = { list, findByEndpoint, save, remove };
