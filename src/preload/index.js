// preload.js
// Cầu nối DUY NHẤT giữa renderer và main process.
// Renderer không có quyền dùng Node.js/OS trực tiếp (contextIsolation: true),
// nên mọi API cần expose ra cho renderer phải đi qua file này.

const { contextBridge, ipcRenderer } = require("electron");
// const channels = require("../../shared/ipc-channels");
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
  TERMINAL_DATA: "terminal:data",
  CREDENTIALS_SAVE: "credentials:save",
  CREDENTIALS_LOAD: "credentials:load",
  CREDENTIALS_DELETE: "credentials:delete",
  SETTINGS_GET_SCHEMA: "settings:get-schema",
  SETTINGS_GET_ALL: "settings:get-all",
  SETTINGS_SET: "settings:set",
  SETTINGS_COMMAND: "settings:command",
  SETTINGS_CHANGED: "settings:changed",
  SETTINGS_SCHEMA_CHANGED: "settings:schema-changed",
};

/**
 * Trả về object API sẽ được expose ra renderer dưới tên window.api.
 * Tách thành hàm riêng để sau này dễ thêm nhóm API mới (fs.*, terminal.*...)
 * mà không phải sửa trực tiếp lệnh gọi contextBridge bên dưới.
 *
 * Hiện tại để RỖNG — đúng tinh thần "make it work first":
 * chỉ xác nhận cầu nối hoạt động, chưa cần chức năng thật.
 */
function getExposedApi() {
  return {
    window: {
      minimize: () => ipcRenderer.send(channels.WINDOW_MINIMIZE),
      maximize: () => ipcRenderer.send(channels.WINDOW_MAXIMIZE),
      close: () => ipcRenderer.send(channels.WINDOW_CLOSE),
    },
    dialog: {
      openFolder: () => ipcRenderer.invoke(channels.DIALOG_OPEN_FOLDER),
    },
    state: {
      loadLastFolder: () => ipcRenderer.invoke(channels.STATE_LOAD_LAST_FOLDER),
    },
    fs: {
      readDirectory: (folderPath) =>
        ipcRenderer.invoke(channels.FS_READ_DIRECTORY, folderPath),
      createFile: (path) => ipcRenderer.invoke(channels.FS_CREATE_FILE, path),
      createFolder: (path) =>
        ipcRenderer.invoke(channels.FS_CREATE_FOLDER, path),
      rename: (oldPath, newPath) =>
        ipcRenderer.invoke(channels.FS_RENAME, oldPath, newPath),
      copy: (src, dest) => ipcRenderer.invoke(channels.FS_COPY, src, dest),
      delete: (path) => ipcRenderer.invoke(channels.FS_DELETE, path),
      readFile: (filePath) => ipcRenderer.invoke("fs:read-file", filePath),
      writeFile: (filePath, content) =>
        ipcRenderer.invoke("fs:write-file", filePath, content),
    },

    terminal: {
      // shellType: 'powershell' | 'cmd'. Backend sẽ tự map ra path thật.
      create: (shellType, cwd) =>
        ipcRenderer.invoke(channels.TERMINAL_CREATE, shellType, cwd),
      write: (data) => ipcRenderer.send(channels.TERMINAL_WRITE, data),
      resize: (cols, rows) =>
        ipcRenderer.send(channels.TERMINAL_RESIZE, cols, rows),
      kill: () => ipcRenderer.send(channels.TERMINAL_KILL),
      // onData: đăng ký callback nhận output từ pty, trả về hàm huỷ đăng ký
      onData: (callback) => {
        const listener = (event, chunk) => callback(chunk);
        ipcRenderer.on(channels.TERMINAL_DATA, listener);
        return () =>
          ipcRenderer.removeListener(channels.TERMINAL_DATA, listener);
      },
    },

    credentials: {
      list: (serviceId) => ipcRenderer.invoke("credentials:list", serviceId),
      save: (serviceId, keyData) =>
        ipcRenderer.invoke("credentials:save", serviceId, keyData),
      load: (serviceId) => ipcRenderer.invoke("credentials:load", serviceId),
      delete: (serviceId, keyId) =>
        ipcRenderer.invoke("credentials:delete", serviceId, keyId),
    },
    providers: {
      createKey: (providerId) =>
        ipcRenderer.invoke(`api:create-key:${providerId}`),
      validateKey: (providerId, keyData) =>
        ipcRenderer.invoke(`api:validate-key:${providerId}`, keyData),
      listModels: (providerId, apiKey) =>
        ipcRenderer.invoke(`api:list-models:${providerId}`, apiKey),
    },
    chat: {
      send: (payload) => ipcRenderer.invoke("chat:send", payload),
    },
    settings: {
      getSchema: () => ipcRenderer.invoke(channels.SETTINGS_GET_SCHEMA),
      getAll: () => ipcRenderer.invoke(channels.SETTINGS_GET_ALL),
      set: (id, value) => ipcRenderer.invoke(channels.SETTINGS_SET, id, value),
      command: (action, payload) =>
        ipcRenderer.invoke(channels.SETTINGS_COMMAND, action, payload),
      onChanged: (callback) => {
        const listener = (event, detail) => callback(detail);
        ipcRenderer.on(channels.SETTINGS_CHANGED, listener);
        return () =>
          ipcRenderer.removeListener(channels.SETTINGS_CHANGED, listener);
      },
      onSchemaChanged: (callback) => {
        const listener = (event, detail) => callback(detail);
        ipcRenderer.on(channels.SETTINGS_SCHEMA_CHANGED, listener);
        return () =>
          ipcRenderer.removeListener(
            channels.SETTINGS_SCHEMA_CHANGED,
            listener,
          );
      },
      theme: {
        getActive: () => ipcRenderer.invoke("theme:get-active"),
        list: () => ipcRenderer.invoke("theme:list"),
      },
    },
  };
}

contextBridge.exposeInMainWorld("api", getExposedApi());
