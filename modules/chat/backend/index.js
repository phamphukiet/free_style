// index.js
// Điểm đăng ký IPC backend của module chat. Logic thật tách ra các thư mục con.

const { ipcMain } = require("electron");
const { readState, writeState } = require("../../../src/main/state");
const sessionStore = require("./session-store");
const { calcDirSize } = require("./project/dir-size");
const { handleSend } = require("./send/send-handler");
const { loadSettingsBridge } = require("./send/resolve");

const settingsBridge = loadSettingsBridge();

function registerChatBackend() {
  // Session IPC
  ipcMain.handle("chat:session-list", () => sessionStore.list());
  ipcMain.handle("chat:session-get", (_, id) => sessionStore.get(id));
  ipcMain.handle("chat:session-save", (_, s) => sessionStore.save(s));
  ipcMain.handle("chat:session-delete", (_, id) => sessionStore.remove(id));

  // Project size IPC
  ipcMain.handle("chat:project-size", (_, folderPath) => {
    return folderPath ? calcDirSize(folderPath) : 0;
  });

  // Send IPC
  ipcMain.handle("chat:send", async (event, payload) => {
    return await handleSend(settingsBridge, payload);
  });

  // Selection IPC
  ipcMain.handle("chat:save-selection", (_, selection) => {
    writeState({ chatSelection: selection });
    return true;
  });

  ipcMain.handle("chat:load-selection", () => {
    return readState().chatSelection || null;
  });
}

module.exports = { registerChatBackend };