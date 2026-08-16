// ipc.js
// Trách nhiệm duy nhất: đăng ký toàn bộ IPC handler cho settings UI.
// Logic thật nằm ở commands.js — file này chỉ forward + notify.

const { ipcMain } = require("electron");
const commands = require("./commands");
const { notifyChanged } = require("./notify");

function registerSettingsIpc() {
  ipcMain.handle("settings:list", () => commands.getAll());
  ipcMain.handle("settings:list-groups", () => commands.listGroups());

  ipcMain.handle("settings:get-all", () => {
    const map = {};
    commands.getAll().forEach((s) => (map[s.id] = s.value));
    return map;
  });

  ipcMain.handle("settings:get", (event, id) => commands.getValue(id));

  ipcMain.handle("settings:set", (event, id, value) => {
    const result = commands.setValue(id, value);
    notifyChanged(id, result);
    return result;
  });

  ipcMain.handle("settings:add-preset", (event, id, preset) =>
    commands.addPreset(id, preset),
  );
  ipcMain.handle("settings:create", (event, def) =>
    commands.createSetting(def),
  );
  ipcMain.handle("settings:update", (event, id, patch) =>
    commands.updateSetting(id, patch),
  );
  ipcMain.handle("settings:delete", (event, id) => commands.deleteSetting(id));
}

module.exports = { registerSettingsIpc };
