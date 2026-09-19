const { executeAiTool } = require("./ai-tools.js");

const {
  getExecutorMiddlewares,
} = require("../../../../../shared/chat-pipeline-registry.js");

function buildToolExecutor({ agentId, notify, sessionId }) {
  const rawExecute = (name, args) =>
    executeAiTool(name, args, { agentId, notify, sessionId });
  return getExecutorMiddlewares().reduce(
    (execute, m) => m.wrap(execute, { agentId, sessionId }),
    rawExecute,
  );
}

module.exports = { buildToolExecutor };
