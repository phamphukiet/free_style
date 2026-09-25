// selector.js — lọc capability theo config / requires / health, rồi sắp xếp.
const config = require("../config");
const {
  getCapability,
  listCapabilities,
  hasCapability,
} = require("../../../../shared/capability-registry");
const { run: runDefaultStrategy } = require("../strategy/default");
const { isTripped } = require("./health");

const isEnabled = (cap) =>
  !config.disabled.includes(cap.id) &&
  !config.disabled.includes(`${cap.kind}:${cap.id}`);

const isReady = (cap) => isEnabled(cap) && cap.requires.every(hasCapability);

function candidates(kind, sessionId) {
  return listCapabilities(kind).filter(
    (cap) => isReady(cap) && !isTripped(sessionId, cap),
  );
}

function pickProvider(providerId) {
  const cap = getCapability("provider", providerId);
  return cap && isReady(cap) ? cap : null;
}

// Tool: thứ tự do strategy quyết định.
function selectTools(ctx) {
  return runDefaultStrategy(ctx, candidates("tool", ctx.sessionId));
}

// Prompt / wrapper: thứ tự cố định theo `order`.
function selectOrdered(kind, ctx) {
  return candidates(kind, ctx.sessionId).sort((a, b) => a.order - b.order);
}

module.exports = { pickProvider, selectTools, selectOrdered };
