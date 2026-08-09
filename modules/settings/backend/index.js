// index.js
// Trách nhiệm duy nhất: nối commands.js với IPC.
// channels.SETTINGS_COMMAND là cổng lệnh chung cho AI/agent —
// action: "list" | "get" | "set" | "reset" | "register".

const { ipcMain, BrowserWindow } = require("electron");
const channels = require("../../../shared/ipc-channels");
const commands = require("./commands");

function broadcast(channel, payload) {
  BrowserWindow.getAllWindows().forEach((win) =>
    win.webContents.send(channel, payload),
  );
}

function registerSettingsIpc() {
  ipcMain.handle(channels.SETTINGS_GET_SCHEMA, () => commands.getDefinitions());
  ipcMain.handle(channels.SETTINGS_GET_ALL, () => commands.getValues());

  ipcMain.handle(channels.SETTINGS_SET, (event, id, value) => {
    const result = commands.setValue(id, value);
    broadcast(channels.SETTINGS_CHANGED, { id, value: result });
    return result;
  });

  ipcMain.handle(channels.SETTINGS_COMMAND, (event, action, payload = {}) => {
    switch (action) {
      case "list":
        return commands.getDefinitions();
      case "get":
        return commands.getValue(payload.id);
      case "set": {
        const value = commands.setValue(payload.id, payload.value);
        broadcast(channels.SETTINGS_CHANGED, { id: payload.id, value });
        return value;
      }
      case "reset": {
        const value = commands.resetValue(payload.id);
        broadcast(channels.SETTINGS_CHANGED, { id: payload.id, value });
        return value;
      }
      case "register": {
        const def = commands.registerSetting(payload);
        broadcast(channels.SETTINGS_SCHEMA_CHANGED, def);
        return def;
      }
      default:
        throw new Error(`Lệnh setting không hợp lệ: "${action}"`);
    }
  });
}

module.exports = { registerSettingsIpc };
