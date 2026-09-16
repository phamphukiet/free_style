// index.js
const { ipcMain } = require("electron");
const { readTextFile, writeTextFile } = require("./editor");

function register() {
  ipcMain.handle("fs:read-file", (event, filePath) => readTextFile(filePath));
  ipcMain.handle("fs:write-file", (event, filePath, content) =>
    writeTextFile(filePath, content),
  );
}

module.exports = { register };