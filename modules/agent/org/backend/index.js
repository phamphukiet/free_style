const { registerOrgIpc } = require("./ipc");

function registerOrgBackend() {
  registerOrgIpc();
}

module.exports = { registerOrgBackend };
