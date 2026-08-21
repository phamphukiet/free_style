// index.js
// Điểm export duy nhất — src/main/ipc.js chỉ cần gọi registerAgentBackend().

const { registerAgentIpc } = require("./ipc");

function registerAgentBackend() {
  registerAgentIpc();
}

module.exports = { registerAgentBackend };
