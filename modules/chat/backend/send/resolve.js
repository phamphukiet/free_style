// resolve.js
// Resolve API key và agent config — optional deps, không crash nếu module vắng.

const {
  loadCredentialsSync,
  decrypt,
} = require("../../../../src/main/ipc/credentials/storage");

function loadSettingsBridge() {
  try { return require("../../../settings/backend/index.js").aiBridge; }
  catch { return null; }
}

function loadAgentStore() {
  try {
    return require("../../../agent/backend/agent/store.js");
  } catch {
    return null;
  }
}

function resolveKey(providerId, keyId) {
  if (!providerId) return null;
  const data = loadCredentialsSync();
  const entries = data[providerId]?.keys;
  if (!entries) return null;
  const entry = keyId ? entries.find((k) => k.id === keyId) : entries[0];
  return entry ? decrypt(entry) : null;
}

function resolveFromAgent(agentId) {
  const store = loadAgentStore();
  if (!store || !agentId) return null;
  return store.get(agentId);
}

function executeSettingsTool(settingsBridge, name, args) {
  if (!settingsBridge) throw new Error("Settings module không khả dụng");
  if (name !== "settings") throw new Error(`Tool "${name}" không tồn tại`);
  return settingsBridge.execute(args.action, args);
}

function loadRuleStore() {
  try { return require("../../../rule/backend/catalog/rules-store.js"); }
  catch { return null; }
}

function loadSkillPromptBuilder() {
  try {
    return require("../../../skill/backend/agent-prompt.js").buildSkillPrompt;
  } catch {
    return null;
  }
}

function buildSystemPrompt(agentId) {
  const store = loadRuleStore();
  const rulePrompt =
    store && agentId
      ? store
          .list()
          .filter(
            (r) => r.enabled !== false && (r.agentIds || []).includes(agentId),
          )
          .map((r) => `## Rule: ${r.name}\n${r.content}`)
          .join("\n\n")
      : "";

  const buildSkillPrompt = loadSkillPromptBuilder();
  const skillPrompt = buildSkillPrompt ? buildSkillPrompt(agentId) : "";

  return [rulePrompt, skillPrompt].filter(Boolean).join("\n\n");
}

module.exports = {
  loadSettingsBridge,
  resolveKey,
  resolveFromAgent,
  executeSettingsTool,
  buildSystemPrompt,
};
