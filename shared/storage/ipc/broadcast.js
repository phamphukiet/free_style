// broadcast.js
// Gửi 1 sự kiện tới mọi cửa sổ renderer còn sống.

const { BrowserWindow } = require("electron");

const CHANGED_CHANNEL = "storage:changed";

/** @param {{ payload: object }} args */
function broadcastChanged({ payload }) {
  BrowserWindow.getAllWindows().forEach((win) => {
    if (!win.isDestroyed()) win.webContents.send(CHANGED_CHANNEL, payload);
  });
}

module.exports = { CHANGED_CHANNEL, broadcastChanged };