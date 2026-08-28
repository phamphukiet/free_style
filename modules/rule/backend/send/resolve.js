function loadRuleStore() {
  try {
    return require("../../../rule/backend/catalog/rules-store.js");
  } catch {
    return null;
  }
}

// Gom nội dung các rule đã gán cho agent (và đang bật) thành 1 khối system prompt.
// Module rule bị xoá / agent chưa gán rule nào -> trả về rỗng, không throw.
function buildSystemPrompt(agentId) {
  const store = loadRuleStore();
  if (!store || !agentId) return "";
  const rules = store
    .list()
    .filter((r) => r.enabled !== false && (r.agentIds || []).includes(agentId));
  if (rules.length === 0) return "";
  return rules.map((r) => `## Rule: ${r.name}\n${r.content}`).join("\n\n");
}

module.exports = {
  loadSettingsBridge,
  resolveKey,
  resolveFromAgent,
  executeSettingsTool,
  buildSystemPrompt,
};
