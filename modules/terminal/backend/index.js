const { app } = require("electron");
const { registerMention } = require("../../../shared/core/mention-registry.js");
const { registerTerminalIpc } = require("./ipc");
const { killShell } = require("./pty/pty-manager");

function register() {
  registerTerminalIpc();
  registerMention("terminal", { hint: "quản lý terminal (tạo/sửa/xoá)" });
  app.on("before-quit", killShell);
  app.on("browser-window-created", (_e, win) => win.on("closed", killShell));
}

module.exports = { register };