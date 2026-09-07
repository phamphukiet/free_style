const { getToolSpec } = require("./spec.js");
const actions = require("./actions.js");

async function execute(action, args = {}) {
  switch (action) {
    case "tree":
      return actions.tree(args);
    case "read":
      return actions.read(args);
    case "write":
      return actions.write(args);
    case "delete":
      return actions.remove(args);
    case "move":
      return actions.move(args);
    default:
      throw new Error(`Action "${action}" không tồn tại.`);
  }
}

module.exports = { getToolSpec, execute };