// ipc.js
// Trách nhiệm duy nhất: đăng ký tất cả các IPC handlers.
// Đã được tách nhỏ thành các file trong thư mục ipc/ để đảm bảo rule < 100 dòng.

const { registerWindowIpc } = require("./ipc/window");
const { registerFsIpc } = require("./ipc/fs");
const { registerTerminalIpc } = require("./ipc/terminal");
const { registerCredentialsIpc } = require("./ipc/credentials/index.js");
const { registerSettingsIpc} = require("../../modules/settings/backend/index.js");
const { app } = require("electron");

function registerWindowIpcWrapper() {
  registerWindowIpc();
  registerFsIpc();
  registerTerminalIpc();
  registerCredentialsIpc();
  registerSettingsIpc();
  try {
    const { registerChatGptBackend } = require("../../modules/api/chatgpt/backend/index.js");
    const { registerGeminiBackend } = require("../../modules/api/gemini/backend/index.js");
    const { registerCodexBackend } = require("../../modules/api/codex/backend/index.js");
    const { registerAntigravityBackend } = require("../../modules/api/antigravity/backend/index.js");
    registerChatGptBackend();
    registerGeminiBackend();
    registerCodexBackend();
    registerAntigravityBackend();
  } catch (e) {
    console.error("Failed to load api backends", e);
  }
  try {
    const {
      registerChatBackend,
    } = require("../../modules/chat/backend/index.js");
    registerChatBackend();
  } catch (e) {
    console.error("Failed to load chat backend", e);
  }
}

module.exports = { registerWindowIpc: registerWindowIpcWrapper };

// Đảm bảo pty process bị kill khi toàn bộ window đóng.
app.on("before-quit", () => {
  require("../../modules/terminal/backend/terminal").killShell();
});