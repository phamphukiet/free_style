// ipc.js
// Trách nhiệm duy nhất: đăng ký tất cả các IPC handlers.
// Đã được tách nhỏ thành các file trong thư mục ipc/ để đảm bảo rule < 100 dòng.

const { registerWindowIpc } = require("./ipc/window");
const { registerFsIpc } = require("./ipc/fs");
const { registerTerminalIpc } = require("./ipc/terminal");
const { registerCredentialsIpc } = require("./ipc/credentials");
const { app } = require("electron");

function registerWindowIpcWrapper() {
  registerWindowIpc();
  registerFsIpc();
  registerTerminalIpc();
  registerCredentialsIpc();
}

module.exports = { registerWindowIpc: registerWindowIpcWrapper };

// Đảm bảo pty process bị kill khi toàn bộ window đóng.
app.on("before-quit", () => {
  require("../../modules/terminal/backend/terminal").killShell();
});