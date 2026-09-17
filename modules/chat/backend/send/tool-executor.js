const { executeAiTool } = require("./ai-tools");
const activeModules = require("../../../active-modules.js");

function loadDedupeLevels() {
  if (!activeModules.includes("dedupe_level")) return {};
  try {
    return require("../../../dedupe_level/index.js");
  } catch {
    return {};
  }
}
const { level01Dedupe, level02Cache } = loadDedupeLevels();

function buildToolExecutor({ agentId, notify, sessionId }) {
  const rawExecute = (name, args) =>
    executeAiTool(name, args, { agentId, notify, sessionId });

  const cached = level02Cache
    ? level02Cache.wrapToolExecutor(rawExecute, sessionId)
    : rawExecute;

  return level01Dedupe ? level01Dedupe.wrapToolExecutor(cached) : cached;
}

module.exports = { buildToolExecutor };
