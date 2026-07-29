"use strict";
const { contextBridge, ipcRenderer } = require("electron");
const channels = require("@shared/ipc-channels");
function getExposedApi() {
  return {
    window: {
      minimize: () => ipcRenderer.send(channels.WINDOW_MINIMIZE),
      maximize: () => ipcRenderer.send(channels.WINDOW_MAXIMIZE),
      close: () => ipcRenderer.send(channels.WINDOW_CLOSE)
    }
  };
}
contextBridge.exposeInMainWorld("api", getExposedApi());
