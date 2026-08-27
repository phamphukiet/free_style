// index.js
const { registerRuleIpc } = require("./ipc");

function registerRuleBackend() {
  registerRuleIpc();
}

module.exports = { registerRuleBackend };
