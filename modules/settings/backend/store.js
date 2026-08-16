// store.js
// Trách nhiệm duy nhất: đọc/ghi dữ liệu settings runtime (giá trị hiện tại,
// mẫu do user/AI thêm cho setting root, và định nghĩa setting origin "create").
// Không đụng tới file .js trong source/root — root chỉ bị ghi đè ở tầng dữ liệu này.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const STORE_FILE = path.join(app.getPath("userData"), "settings-store.json");

function readStore() {
  try {
    return JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"));
  } catch {
    return { values: {}, presets: {}, created: {} };
  }
}

function writeStore(data) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function getValue(id) {
  return readStore().values[id];
}

function setValue(id, value) {
  const data = readStore();
  data.values[id] = value;
  writeStore(data);
}

function getPresets(id) {
  return readStore().presets[id] || [];
}

function addPreset(id, preset) {
  const data = readStore();
  if (!data.presets[id]) data.presets[id] = [];
  data.presets[id].push(preset);
  writeStore(data);
}

function getCreated() {
  return readStore().created;
}

function saveCreated(def) {
  const data = readStore();
  data.created[def.id] = def;
  writeStore(data);
}

function deleteCreated(id) {
  const data = readStore();
  delete data.created[id];
  delete data.values[id];
  writeStore(data);
}

module.exports = {
  getValue,
  setValue,
  getPresets,
  addPreset,
  getCreated,
  saveCreated,
  deleteCreated,
};
