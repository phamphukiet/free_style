// system.js
// Trách nhiệm duy nhất: mở link ngoài bằng trình duyệt mặc định hệ điều hành.

const { ipcMain, shell } = require("electron");

function registerSystemIpc() {
  ipcMain.handle("system:open-external", (event, url) => {
    if (typeof url !== "string" || !/^https?:\/\//.test(url)) return false;
    shell.openExternal(url);
    return true;
  });
}

module.exports = { registerSystemIpc };
