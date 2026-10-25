// ipc.js
// Trách nhiệm duy nhất: nối kênh IPC đọc/ghi file với fs-text.js.
const { ipcMain } = require("electron");
const { readTextFile, writeTextFile } = require("./fs-text");

function registerFileIpc() {
  ipcMain.handle("fs:read-file", (event, filePath) => readTextFile(filePath));
  ipcMain.handle("fs:write-file", (event, filePath, content) =>
    writeTextFile(filePath, content),
  );
}

module.exports = { registerFileIpc };
