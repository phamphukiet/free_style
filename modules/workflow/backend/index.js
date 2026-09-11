// index.js
const { registerWorkflowIpc } = require("./ipc");

function registerWorkflowBackend() {
  registerWorkflowIpc();
}

module.exports = { registerWorkflowBackend };
