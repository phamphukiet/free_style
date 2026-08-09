// notify.js
// Trách nhiệm duy nhất: báo cho renderer biết setting vừa đổi.
// Dùng chung cho đường IPC (người dùng đổi qua UI) và đường tool-call (agent đổi qua chat).

const { BrowserWindow } = require("electron");
const channels = require("../../../shared/ipc-channels");

function notifyChanged(id, value) {
  BrowserWindow.getAllWindows().forEach((win) =>
    win.webContents.send(channels.SETTINGS_CHANGED, { id, value }),
  );
}

function notifySchemaChanged(def) {
  BrowserWindow.getAllWindows().forEach((win) =>
    win.webContents.send(channels.SETTINGS_SCHEMA_CHANGED, def),
  );
}

module.exports = { notifyChanged, notifySchemaChanged };
