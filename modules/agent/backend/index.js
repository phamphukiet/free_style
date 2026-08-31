// index.js
// Điểm export duy nhất — src/main/ipc.js chỉ cần gọi registerAgentBackend().

const { registerAgentIpc } = require("./ipc");

function loadOrgBackend() {
  try {
    return require("../org/backend/index.js").registerOrgBackend;
  } catch {
    return null;
  }
}

function registerAgentBackend() {
  registerAgentIpc();
  const registerOrgBackend = loadOrgBackend();
  if (registerOrgBackend) registerOrgBackend();
}

module.exports = { registerAgentBackend };
