// platforms-store.js
// CRUD nền tảng tải skill — lưu userData/skill-platforms.json.
// Không seed sẵn nền tảng nào, người dùng tự thêm qua paste URL.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const FILE = path.join(app.getPath("userData"), "skill-platforms.json");

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
  const data = readAll();
  delete data[id];
  writeAll(data);
  return true;
}

module.exports = { list, findByEndpoint, save, remove };
