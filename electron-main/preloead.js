// preload.js
// Cầu nối DUY NHẤT giữa renderer và main process.
// Renderer không có quyền dùng Node.js/OS trực tiếp (contextIsolation: true),
// nên mọi API cần expose ra cho renderer phải đi qua file này.

const { contextBridge } = require("electron");

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
    // sẽ bổ sung dần: fs: {...}, terminal: {...}, window: {...}
  };
}

contextBridge.exposeInMainWorld("api", getExposedApi());
