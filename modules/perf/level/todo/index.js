// index.js — điểm export duy nhất cho AI tool "todo".
const { getToolSpec } = require("./spec");
const actions = require("./actions");
const { renderTodoPrompt } = require("./prompt");

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

module.exports = { getToolSpec, execute, renderTodoPrompt };
