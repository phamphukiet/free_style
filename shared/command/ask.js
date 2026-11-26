// shared/command/ask.js
// Hỏi agent "manager" 1 lượt, không tool. Thiếu agent/provider/key thì ném lỗi.
// Require lười: test chạy bằng node thuần không bị kéo theo electron.

const NO_AGENTS = Object.freeze({ get: () => null });

function keyOf({ providerId, keyId }) {
  const {
    loadCredentialsSync,
    decrypt,
  } = require("../../src/main/ipc/credentials/storage");
  const entries = loadCredentialsSync()[providerId]?.keys || [];
  const entry = keyId ? entries.find((k) => k.id === keyId) : entries[0];
  return entry ? decrypt(entry) : null;
}

/** @param {{ system: string, text: string }} args */
async function ask({ system, text }) {
  const {
    getService,
    getCapability,
  } = require("../core/capability-registry.js");
  const agents = getService({
    id: "agents",
    needs: ["get"],
    fallback: NO_AGENTS,
  });
  const agent = agents.get({ id: "manager" });
  const provider =
    agent && getCapability({ kind: "provider", id: agent.providerId });
  const apiKey = provider && keyOf(agent);
  if (!apiKey) throw new Error('agent "manager" chưa gán provider/key');
  const reply = await provider.client.chatCompletion(
    apiKey,
    text,
    agent.model,
    system,
  );
  return typeof reply === "object" ? reply.content : reply;
}

module.exports = { ask };