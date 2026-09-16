// index.js
const { registerRuleIpc } = require("./ipc");

function register() {
  registerRuleIpc();
}

module.exports = { register };
