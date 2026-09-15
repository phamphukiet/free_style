const { executeAiTool } = require("./ai-tools");
const {
  level01Dedupe,
  level02Cache,
} = require("../../../dedupe_level/index.js");

function buildToolExecutor({ agentId, notify, sessionId }) {
  const rawExecute = (name, args) =>
    executeAiTool(name, args, { agentId, notify, sessionId });

  const cached = level02Cache
    ? level02Cache.wrapToolExecutor(rawExecute, sessionId)
    : rawExecute;

  return level01Dedupe ? level01Dedupe.wrapToolExecutor(cached) : cached;
}

module.exports = { buildToolExecutor };
