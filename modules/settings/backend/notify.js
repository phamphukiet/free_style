// notify.js
// Trách nhiệm duy nhất: báo cho mọi renderer window biết 1 setting vừa đổi giá trị,
// để phần nghe (editor.js, terminal-manager.js...) tự áp dụng real-time.

const { BrowserWindow } = require("electron");

function notifyChanged(id, value) {
  BrowserWindow.getAllWindows().forEach((win) => {
    if (win.isDestroyed()) return;
    win.webContents.send("settings:changed", { id, value });
  });
}

module.exports = { notifyChanged };
