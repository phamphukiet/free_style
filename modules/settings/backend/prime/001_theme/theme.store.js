// theme.store.js
// Lưu theme do người dùng/agent tạo — tách file riêng khỏi settings.json
// vì đây là "định nghĩa" (giống registry), không phải giá trị người dùng chọn.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const THEMES_FILE = path.join(app.getPath("userData"), "custom-themes.json");

function readCustomThemes() {
  try {
    return JSON.parse(fs.readFileSync(THEMES_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeCustomThemes(themes) {
  fs.writeFileSync(THEMES_FILE, JSON.stringify(themes, null, 2), "utf-8");
}

module.exports = { readCustomThemes, writeCustomThemes };
