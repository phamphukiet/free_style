// index.js
const { registerKanbanIpc } = require("./ipc");

function register() {
  registerKanbanIpc();
}

module.exports = { register };