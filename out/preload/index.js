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
  FS_COPY: "fs:copy",
  TERMINAL_CREATE: "terminal:create",
  TERMINAL_WRITE: "terminal:write",
  TERMINAL_RESIZE: "terminal:resize",
  TERMINAL_KILL: "terminal:kill",
  TERMINAL_DATA: "terminal:data"
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
    },
    terminal: {
      // shellType: 'powershell' | 'cmd'. Backend sẽ tự map ra path thật.
      create: (shellType, cwd) => ipcRenderer.invoke(channels.TERMINAL_CREATE, shellType, cwd),
      write: (data) => ipcRenderer.send(channels.TERMINAL_WRITE, data),
      resize: (cols, rows) => ipcRenderer.send(channels.TERMINAL_RESIZE, cols, rows),
      kill: () => ipcRenderer.send(channels.TERMINAL_KILL),
      // onData: đăng ký callback nhận output từ pty, trả về hàm huỷ đăng ký
      onData: (callback) => {
        const listener = (event, chunk) => callback(chunk);
        ipcRenderer.on(channels.TERMINAL_DATA, listener);
        return () => ipcRenderer.removeListener(channels.TERMINAL_DATA, listener);
      }
    },
    credentials: {
      list: (serviceId) => ipcRenderer.invoke("credentials:list", serviceId),
      save: (serviceId, keyData) => ipcRenderer.invoke("credentials:save", serviceId, keyData),
      load: (serviceId) => ipcRenderer.invoke("credentials:load", serviceId),
      delete: (serviceId, keyId) => ipcRenderer.invoke("credentials:delete", serviceId, keyId)
    },
    providers: {
      createKey: (providerId) => ipcRenderer.invoke(`api:create-key:${providerId}`),
      validateKey: (providerId, keyData) => ipcRenderer.invoke(`api:validate-key:${providerId}`, keyData)
    }
  };
}
contextBridge.exposeInMainWorld("api", getExposedApi());
