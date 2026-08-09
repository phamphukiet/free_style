// store.js
// Trách nhiệm duy nhất: đọc/ghi giá trị setting người dùng đã tuỳ chỉnh
// vào file settings.json trong thư mục userData.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const SETTINGS_FILE = path.join(app.getPath("userData"), "settings.json");

function readValues() {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeValues(values) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(values, null, 2), "utf-8");
}

module.exports = { readValues, writeValues };
