// modules-flags.js
// Expose danh sách module đang bật (đọc từ modules/active-modules.js)
// sang renderer, để workbench.js biết import frontend module nào.

const { ipcMain } = require("electron");
const channels = require("../../../shared/ipc-channels");
const activeModules = require("../../../modules/active-modules.js");

function registerModulesIpc() {
  ipcMain.handle(channels.MODULES_ACTIVE, () => activeModules);
}

module.exports = { registerModulesIpc };
