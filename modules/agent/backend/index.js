// index.js
// Điểm export duy nhất — src/main/ipc.js chỉ cần gọi registerAgentBackend().

function registerAgentBackend() {
  try {
    require("./agent/ipc").registerAgentIpc();
  } catch (e) {
    console.error("Failed to load agent-core backend", e);
  }
  
  try {
    require("./org/ipc").registerOrgIpc();
  } catch (e) {
    console.error("Failed to load org backend", e);
  }
}

module.exports = { registerAgentBackend };
