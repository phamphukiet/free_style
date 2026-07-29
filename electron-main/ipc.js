// ipc.js
// Trách nhiệm duy nhất: lắng nghe lệnh từ renderer (qua preload) và
// thao tác lên BrowserWindow tương ứng. Không tạo window, không tạo menu.

const { ipcMain, BrowserWindow } = require("electron");
const channels = require("../shared/ipc-channels");

function registerWindowIpc() {
  ipcMain.on(channels.WINDOW_MINIMIZE, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
  });

  ipcMain.on(channels.WINDOW_MAXIMIZE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win?.isMaximized()) win.unmaximize();
    else win?.maximize();
  });

  ipcMain.on(channels.WINDOW_CLOSE, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });
}

module.exports = { registerWindowIpc };
