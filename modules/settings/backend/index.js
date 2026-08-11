// index.js
const { ipcMain, BrowserWindow } = require("electron");
const channels = require("../../../shared/ipc-channels");
const commands = require("./core/commands");
const sources = require("./sources");
const { notifyChanged, notifySchemaChanged } = require("./core/notify");

function registerSettingsIpc() {
  sources.initSources();
  ipcMain.handle(channels.SETTINGS_GET_SCHEMA, () => commands.getDefinitions());
  ipcMain.handle(channels.SETTINGS_GET_ALL, () => commands.getValues());

  ipcMain.handle(channels.SETTINGS_SET, (event, id, value) => {
    const result = commands.setValue(id, value);
    notifyChanged(id, result);
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
        notifyChanged(payload.id, value);
        return value;
      }
      case "reset": {
        const value = commands.resetValue(payload.id);
        notifyChanged(payload.id, value);
        return value;
      }
      case "register": {
        const def = commands.registerSetting(payload);
        notifySchemaChanged(def);
        return def;
      }
      case "delete": {
        commands.deleteSetting(payload.id);
        notifySchemaChanged({ id: payload.id, deleted: true });
        return { id: payload.id, deleted: true };
      }
      default: {
        const handler = sources.getExtraActions()[action];
        if (!handler) throw new Error(`Lệnh setting không hợp lệ: "${action}"`);
        return handler(payload); // action tự notify nếu cần, index.js không đoán
      }
    }
  });
}

module.exports = { registerSettingsIpc };