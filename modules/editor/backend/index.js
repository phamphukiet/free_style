// index.js
const { ipcMain } = require("electron");
const { readTextFile, writeTextFile } = require("./editor");
const { registerMention } = require("../../../shared/mention-registry.js");

function register() {
  ipcMain.handle("fs:read-file", (event, filePath) => readTextFile(filePath));
  ipcMain.handle("fs:write-file", (event, filePath, content) =>
    writeTextFile(filePath, content),
  );
  registerMention("editor", {
    hint: "quản lý trình soạn thảo (tạo/sửa/xoá/run)",
  });
}

module.exports = { register };
