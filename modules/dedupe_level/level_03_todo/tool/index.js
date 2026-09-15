const { getToolSpec } = require("./spec.js");
const actions = require("./actions.js");

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

module.exports = { getToolSpec, execute };
