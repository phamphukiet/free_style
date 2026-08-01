// ipc.js
// Trách nhiệm duy nhất: lắng nghe lệnh từ renderer (qua preload) và
// thao tác lên BrowserWindow tương ứng. Không tạo window, không tạo menu.

const { ipcMain, BrowserWindow, dialog } = require("electron");
const channels = require("../../shared/ipc-channels");
const fs = require("fs");
const { readState, writeState } = require("./state");

function readFolderEntries(folderPath) {
  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .map((entry) => ({ name: entry.name, isDirectory: entry.isDirectory() }));
}

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

  ipcMain.handle(channels.DIALOG_OPEN_FOLDER, async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });
    if (result.canceled || result.filePaths.length === 0) return null;

    const folderPath = result.filePaths[0];
    writeState({ lastFolder: folderPath });
    return { folderPath, entries: readFolderEntries(folderPath) };
  });

  ipcMain.handle(channels.STATE_LOAD_LAST_FOLDER, () => {
    const { lastFolder } = readState();
    if (!lastFolder || !fs.existsSync(lastFolder)) return null;
    return { folderPath: lastFolder, entries: readFolderEntries(lastFolder) };
  });
}

module.exports = { registerWindowIpc };
