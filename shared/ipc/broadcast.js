// Gửi 1 sự kiện tới mọi cửa sổ renderer còn sống.

const { BrowserWindow } = require("electron");

/** @param {{ channel: string, payload?: any }} args */
function broadcast({ channel, payload }) {
  BrowserWindow.getAllWindows().forEach((win) => {
    if (!win.isDestroyed()) win.webContents.send(channel, payload);
  });
}

module.exports = { broadcast };
