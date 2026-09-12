// ipc.js
// Trách nhiệm duy nhất: đăng ký tất cả các IPC handlers.
// Đã được tách nhỏ thành các file trong thư mục ipc/ để đảm bảo rule < 100 dòng.

const { registerWindowIpc } = require("./ipc/window");
const { registerFsIpc } = require("./ipc/fs");
const { registerTerminalIpc } = require("./ipc/terminal");
const { registerCredentialsIpc } = require("./ipc/credentials/index.js");
const { app } = require("electron");
const { registerSystemIpc } = require("./ipc/open_link.js");

function registerWindowIpcWrapper() {
  registerWindowIpc();
  registerFsIpc();
  registerTerminalIpc();
  registerSystemIpc();
  registerCredentialsIpc();
  try {
    const {
      registerChatGptBackend,
    } = require("../../modules/api/chatgpt/backend/index.js");
    const {
      registerGeminiBackend,
    } = require("../../modules/api/gemini/backend/index.js");
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

  try {
    const {
      registerSettingsBackend,
    } = require("../../modules/settings/backend/index.js");
    registerSettingsBackend();
  } catch (e) {
    console.error("Failed to load settings backend", e);
  }

  try {
    const {
      registerAgentBackend,
    } = require("../../modules/agent/backend/index.js");
    registerAgentBackend();
  } catch (e) {
    console.error("Failed to load agent backend", e);
  }

  try {
    const {
      registerSkillBackend,
    } = require("../../modules/skill/backend/index.js");
    registerSkillBackend();
  } catch (e) {
    console.error("Failed to load skill backend", e);
  }
  try {
    const {
      registerRuleBackend,
    } = require("../../modules/rule/backend/index.js");
    registerRuleBackend();
  } catch (e) {
    console.error("Failed to load rule backend", e);
  }

  try {
    const {
      registerKanbanBackend,
    } = require("../../modules/kanban/backend/index.js");
    registerKanbanBackend();
  } catch (e) {
    console.error("Failed to load kanban backend", e);
  }
}

module.exports = { registerWindowIpc: registerWindowIpcWrapper };

app.on("before-quit", () => {
  require("../../modules/terminal/backend/terminal").killShell();
});
