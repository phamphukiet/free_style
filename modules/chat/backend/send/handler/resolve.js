// resolve.js
// Resolve API key và agent config — optional deps, không crash nếu module vắng.

const {
  loadCredentialsSync,
  decrypt,
} = require("../../../../../src/main/ipc/credentials/storage.js");
const {
  getPromptContributors,
} = require("../../../../../shared/chat-pipeline-registry.js");

function loadAgentStore() {
  try {
    return require("../../../../agent/backend/agent/store.js");
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

function buildSystemPrompt(ctx) {
  return getPromptContributors()
    .map((c) => c.fn(ctx))
    .filter(Boolean)
    .join("\n\n");
}

module.exports = {
  resolveKey,
  resolveFromAgent,
  buildSystemPrompt,
};
