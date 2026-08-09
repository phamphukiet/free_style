// theme.ipc.js
// IPC riêng cho renderer đọc theme lúc khởi động và khi có UI Settings sau này.
// Agent KHÔNG đi qua đây — agent đi qua settings:command (theme.actions.js).

const { ipcMain } = require("electron");
const commands = require("./theme.commands");

function registerThemeIpc() {
  ipcMain.handle("theme:get-active", () => commands.getActiveTheme());
  ipcMain.handle("theme:list", () => commands.getAllThemes());
}

module.exports = { registerThemeIpc };
