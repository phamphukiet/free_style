// index.js
// Điểm export duy nhất — src/main/ipc.js chỉ cần gọi registerAgentBackend().
const { registerMention } = require("../../../shared/mention-registry.js");

function register() {
  try {
    require("./agent/ipc").registerAgentIpc();
  } catch (e) {
    console.error("Failed to load agent-core backend", e);
  }
  registerMention("agent", { hint: "quản lý agent AI (tạo/sửa/xoá/test)" });
}

module.exports = { register };
