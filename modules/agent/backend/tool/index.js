// index.js — điểm export duy nhất cho AI tool "agent".

const { getToolSpec } = require("./spec.js");
const actions = require("./actions.js");

async function execute(action, args = {}) {
  switch (action) {
    case "list":
      return actions.list();
    case "create":
      return actions.create(args);
    case "update":
      return actions.update(args);
    case "delete":
      return actions.remove(args);
    case "test":
      return actions.test(args);
    default:
      throw new Error(`Action "${action}" không tồn tại.`);
  }
}

module.exports = { getToolSpec, execute };
