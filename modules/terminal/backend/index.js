const { registerTerminalIpc } = require("../../../src/main/ipc/terminal.js");
const { registerMention } = require("../../../shared/core/mention-registry.js");
const { app } = require("electron");
const { killShell } = require("./terminal");

function register() {
  registerTerminalIpc();
  registerMention("terminal", { hint: "quản lý terminal (tạo/sửa/xoá)" });
  app.on("before-quit", killShell);
  app.on("browser-window-created", (_e, win) => win.on("closed", killShell));
}
