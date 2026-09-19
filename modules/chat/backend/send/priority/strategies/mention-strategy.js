// mention-strategy.js
// Ưu tiên tool theo @mention trong message — override cao nhất (order thấp
// nhất). Mention là one-shot: không ghi lastToolUsed.

const { registerStrategy } = require("../strategy-registry.js");
const {
  extractMentions,
} = require("../../../../../../shared/mention-registry.js");

function resolve({ message }) {
  const mentioned = extractMentions(message);
  if (mentioned.length === 0) return null;
  return { priorityNames: mentioned.map((m) => m.toolName) };
}

function commit() {
  // one-shot, không ghi lastToolUsed
}

registerStrategy("mention", { resolve, commit, order: 0 });
