// modules/runner/backend/index.js
const { registerRunnerIpc } = require("./ipc");

function register() {
  registerRunnerIpc();
}

module.exports = { register };