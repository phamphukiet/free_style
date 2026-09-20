// default.js — @mention trước, rồi tool dùng gần nhất, rồi theo `order`.
const { extractMentions } = require("../../../../shared/mention-registry.js");

const name = "default";

function rank(cap, mentioned, lastTool) {
  if (mentioned.has(cap.id)) return 0;
  return cap.id === lastTool ? 1 : 2;
}

function run(ctx, candidates) {
  const mentions = extractMentions(ctx.message || "");
  const mentioned = new Set(mentions.map((m) => m.toolName));
  const rk = (cap) => rank(cap, mentioned, ctx.lastTool);
  return [...candidates].sort((a, b) => rk(a) - rk(b) || a.order - b.order);
}

module.exports = { name, run };
