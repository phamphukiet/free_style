// index.js
const { registerRuleIpc } = require("./api/ipc.js");
const { registerMention } = require("../../../shared/mention-registry.js");
const {
  registerPromptContributor,
} = require("../../../shared/chat-pipeline-registry.js");
const rulesStore = require("./catalog/rules-store");

function buildRulePrompt({ agentId }) {
  if (!agentId) return "";
  const rules = rulesStore
    .list()
    .filter((r) => r.enabled !== false && (r.agentIds || []).includes(agentId));
  if (rules.length === 0) return "";
  return rules.map((r) => `## Rule: ${r.name}\n${r.content}`).join("\n\n");
}

function register() {
  registerRuleIpc();
  registerMention("rule", {
    hint: "quản lý rule (tạo/sửa/xoá/gán)",
  });
  registerPromptContributor("rule", buildRulePrompt, 10);
  registerToolBridge("rule", require("./api/tool-bridge.js"), {
    notify: "rule:ai-changed",
  });
}

module.exports = { register };
