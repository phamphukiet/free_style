const { registerTerminalIpc } = require("../../../src/main/ipc/terminal.js");

function register() {
  registerTerminalIpc();
}

module.exports = { register };
