// index.js
// Điểm export duy nhất — src/main/ipc.js chỉ cần gọi registerSettingsBackend().

const { registerSettingsIpc } = require("./ipc");

function registerSettingsBackend() {
  registerSettingsIpc();
}

module.exports = { registerSettingsBackend };
