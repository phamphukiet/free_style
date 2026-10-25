// index.js
// Điểm export duy nhất — src/main/ipc.js chỉ cần gọi registerAgentBackend().
const { registerMention } = require("../../../shared/core/mention-registry.js");
const {
  registerCapability,
} = require("../../../shared/core/capability-registry.js");
const { getToolSpec, execute } = require("./tool/index.js");
const { agentService } = require("./agent/service.js");

function register() {
  try {
    require("./agent/ipc").registerAgentIpc();
  } catch (e) {
    console.error("Failed to load agent-core backend", e);
  }
  registerMention("agent", { hint: "quản lý agent AI (tạo/sửa/xoá/test)" });
  registerCapability({ id: "agents", kind: "service", api: agentService });
  registerCapability({
    id: "agent",
    kind: "tool",
    spec: getToolSpec(),
    execute: (args) => execute({ action: args.action, args }),
  });
}

module.exports = { register };
