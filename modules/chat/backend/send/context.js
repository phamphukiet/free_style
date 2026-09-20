// context.js — gom payload + agent + session thành ctx dùng chung cho cả luồng gửi.
const { getCapability } = require("../../../../shared/capability-registry");
const {
  loadCredentialsSync,
  decrypt,
} = require("../../../../src/main/ipc/credentials/storage");
const sessionStore = require("../session/store");

// Agent là dịch vụ tuỳ chọn: module agent bị xoá -> null, không crash.
function agentConfig(agentId) {
  const service = getCapability("service", "agents");
  return agentId && service ? service.api.get(agentId) : null;
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
