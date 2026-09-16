// index.js
// Điểm export duy nhất — src/main/ipc.js chỉ cần gọi registerSettingsBackend().

const { registerSettingsIpc } = require("./ipc");
const aiBridge = require("./ai-bridge");
const { loadRootAiExtensions } = require("./loader");

function register() {
  registerSettingsIpc();
  loadRootAiExtensions();
}

module.exports = { register, aiBridge };
