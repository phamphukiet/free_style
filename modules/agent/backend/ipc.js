// ipc.js
// Trách nhiệm duy nhất: đăng ký IPC handler cho agent. Logic thật ở store.js.

const { ipcMain } = require("electron");
const store = require("./store");

function registerAgentIpc() {
  ipcMain.handle("agent:list", () => store.list());
  ipcMain.handle("agent:get", (event, id) => store.get(id));
  ipcMain.handle("agent:save", (event, agent) => store.save(agent));
  ipcMain.handle("agent:delete", (event, id) => store.remove(id));
}

module.exports = { registerAgentIpc };
