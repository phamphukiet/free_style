const { getToolSpec } = require("./spec");
const actions = require("./actions");
const { renderTodoPrompt } = require("./prompt");
const {
  registerToolBridge,
} = require("../../../../shared/capability-registry");
const {
  registerPromptContributor,
} = require("../../../../shared/chat-pipeline-registry");

function execute(action, args = {}, sessionId) {
  switch (action) {
    case "list":
      return actions.list(sessionId);
    case "write":
      return actions.write(sessionId, args.items);
    default:
      throw new Error(`Action "${action}" không tồn tại.`);
  }
}

function register() {
  registerToolBridge("todo", {
    getToolSpec,
    execute: (args, ctx) => execute(args.action, args, ctx.sessionId),
  });
  registerPromptContributor(
    "todo",
    (ctx) => renderTodoPrompt(ctx.sessionId),
    20,
  );
}

module.exports = { getToolSpec, execute, renderTodoPrompt, register };