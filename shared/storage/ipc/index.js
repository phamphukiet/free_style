// Đăng ký handler storage:* vào ipcMain. Logic nằm ở handlers.js.

const { ipcMain } = require("electron");
const { registry } = require("../registry/registry");
const { createHandlers } = require("./handlers");
const { broadcastChanged } = require("./broadcast");

function registerStorageIpc() {
  const handlers = createHandlers({ registry, broadcast: broadcastChanged });
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, (event, payload = {}) => handler(payload));
  });
}

module.exports = { registerStorageIpc };