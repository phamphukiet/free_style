// index.js (platform registry)
// Trách nhiệm duy nhất: cho backend/terminal.js biết dùng platform nào
// dựa trên shellType, không cần if/else rải rác.
// Thêm shell mới (VD: wsl) → tạo thư mục platform/wsl/wsl.js rồi đăng ký ở đây.

const cmd = require("./cmd/cmd");
const powershell = require("./powershell/powershell");

const REGISTRY = {
  [cmd.id]: cmd,
  [powershell.id]: powershell,
};

const DEFAULT_SHELL_ID = "powershell";

function getPlatform(shellType) {
  return REGISTRY[shellType] || REGISTRY[DEFAULT_SHELL_ID];
}

function listPlatforms() {
  return Object.values(REGISTRY).map(({ id, label }) => ({ id, label }));
}

module.exports = { getPlatform, listPlatforms, DEFAULT_SHELL_ID };
