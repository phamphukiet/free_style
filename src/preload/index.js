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
  };
}

contextBridge.exposeInMainWorld("api", getExposedApi());
