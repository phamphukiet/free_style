// index.js
// Điểm export duy nhất — src/main/ipc.js chỉ cần gọi registerAgentBackend().

const { registerAgentIpc } = require("./ipc");
const { registerOrgIpc } = require("./org/ipc");

function registerAgentBackend() {
  registerAgentIpc();
  registerOrgIpc();
}

module.exports = { registerAgentBackend };
