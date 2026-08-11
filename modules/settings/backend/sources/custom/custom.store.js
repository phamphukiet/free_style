// custom.store.js — đọc/ghi định nghĩa setting do user/AI tự tạo,
// tách khỏi settings.json (đó là giá trị, đây là định nghĩa).
const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const FILE = path.join(app.getPath("userData"), "custom-settings.json");

function readDefinitions() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}
function writeDefinitions(defs) {
  fs.writeFileSync(FILE, JSON.stringify(defs, null, 2), "utf-8");
}

module.exports = { readDefinitions, writeDefinitions };
