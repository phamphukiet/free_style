const { getToolSpec, execute } = require("./tool/index.js");

module.exports = {
  getToolSpec,
  execute: (args = {}) => execute(args.action, args),
};
