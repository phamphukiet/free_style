// index.js
const { registerKanbanIpc } = require("./ipc");

function registerKanbanBackend() {
  registerKanbanIpc();
}

module.exports = { registerKanbanBackend };