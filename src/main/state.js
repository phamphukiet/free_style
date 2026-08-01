// state.js
// Đọc/ghi file trạng thái app (JSON) trong thư mục userData —
// đúng cách VSCode lưu global state, không phải localStorage renderer.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const STATE_FILE = path.join(app.getPath("userData"), "state.json");

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeState(partial) {
  const next = { ...readState(), ...partial };
  fs.writeFileSync(STATE_FILE, JSON.stringify(next, null, 2), "utf-8");
}

module.exports = { readState, writeState };
