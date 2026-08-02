"use strict";
const { contextBridge, ipcRenderer } = require("electron");
const channels = {
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_MAXIMIZE: "window:maximize",
  WINDOW_CLOSE: "window:close",
  DIALOG_OPEN_FOLDER: "dialog:open-folder",
  STATE_LOAD_LAST_FOLDER: "state:load-last-folder",
  FS_READ_DIRECTORY: "fs:read-directory",
  FS_CREATE_FILE: "fs:create-file",
  FS_CREATE_FOLDER: "fs:create-folder",
  FS_RENAME: "fs:rename",
  FS_DELETE: "fs:delete",
  FS_COPY: "fs:copy"
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
    },
    fs: {
      readDirectory: (folderPath) => ipcRenderer.invoke(channels.FS_READ_DIRECTORY, folderPath),
      createFile: (path) => ipcRenderer.invoke(channels.FS_CREATE_FILE, path),
      createFolder: (path) => ipcRenderer.invoke(channels.FS_CREATE_FOLDER, path),
      rename: (oldPath, newPath) => ipcRenderer.invoke(channels.FS_RENAME, oldPath, newPath),
      copy: (src, dest) => ipcRenderer.invoke(channels.FS_COPY, src, dest),
      delete: (path) => ipcRenderer.invoke(channels.FS_DELETE, path),
      readFile: (filePath) => ipcRenderer.invoke("fs:read-file", filePath),
      writeFile: (filePath, content) => ipcRenderer.invoke("fs:write-file", filePath, content)
    }
  };
}
contextBridge.exposeInMainWorld("api", getExposedApi());
