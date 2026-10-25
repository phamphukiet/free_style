// context.js — gom payload + agent + session thành ctx dùng chung cho cả luồng gửi.
const {
  getCapability,
} = require("../../../../shared/core/capability-registry");
const {
  loadCredentialsSync,
  decrypt,
} = require("../../../../src/main/ipc/credentials/storage");
const sessionStore = require("../session/store");
const { getService } = require("../../../../shared/core/capability-registry");

// Hợp đồng chat cần từ service "agents": get({ id }) -> { providerId, keyId, model } | null.
// Thiếu service (module agent bị xóa) hoặc sai hợp đồng -> bỏ qua agent, chat vẫn chạy.
const NO_AGENTS = Object.freeze({ get: () => null });

function agentConfig(agentId) {
  if (!agentId) return null;
  const agents = getService({
    id: "agents",
    needs: ["get"],
    fallback: NO_AGENTS,
  });
  return agents.get({ id: agentId });
}

function resolveKey(providerId, keyId) {
  const entries = loadCredentialsSync()[providerId]?.keys || [];
  const entry = keyId ? entries.find((k) => k.id === keyId) : entries[0];
  return entry ? decrypt(entry) : null;
}

function buildContext(payload) {
  const agent = agentConfig(payload.agentId);
  const session = payload.sessionId
    ? sessionStore.get(payload.sessionId)
    : null;
  return {
    message: payload.message,
    agentId: payload.agentId || null,
    sessionId: payload.sessionId || null,
    providerId: agent?.providerId || payload.providerId,
    keyId: agent?.keyId || payload.keyId,
    model: agent?.model || payload.model,
    lastTool: session?.lastToolUsed || null,
    calledTools: [],
  };
}

module.exports = { buildContext, resolveKey };
