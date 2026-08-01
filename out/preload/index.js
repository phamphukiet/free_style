"use strict";
const { contextBridge, ipcRenderer } = require("electron");
const channels = {
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_MAXIMIZE: "window:maximize",
  WINDOW_CLOSE: "window:close",
  DIALOG_OPEN_FOLDER: "dialog:open-folder",
  STATE_LOAD_LAST_FOLDER: "state:load-last-folder"
};
function getExposedApi() {
  return {
    window: {
      minimize: () => ipcRenderer.send(channels.WINDOW_MINIMIZE),
      maximize: () => ipcRenderer.send(channels.WINDOW_MAXIMIZE),
      close: () => ipcRenderer.send(channels.WINDOW_CLOSE)
    },
    dialog: {
      openFolder: () => ipcRenderer.invoke(channels.DIALOG_OPEN_FOLDER)
    },
    state: {
      loadLastFolder: () => ipcRenderer.invoke(channels.STATE_LOAD_LAST_FOLDER)
    }
  };
}
contextBridge.exposeInMainWorld("api", getExposedApi());
