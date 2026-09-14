// tool-executor.js
// Trách nhiệm duy nhất: build executeToolCall cho toolSend, tự bọc dedupe

const { executeAiTool } = require("./ai-tools");
const { dedupe } = require("../../../dedupe_level/index.js");

function buildToolExecutor({ agentId, notify, sessionId }) {
  const rawExecute = (name, args) =>
    executeAiTool(name, args, { agentId, notify, sessionId });
  return dedupe ? dedupe.wrapToolExecutor(rawExecute) : rawExecute;
}

module.exports = { buildToolExecutor };
