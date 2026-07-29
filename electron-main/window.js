// window.js
// Trách nhiệm duy nhất: tạo và trả về BrowserWindow chính của app.
// Không xử lý menu, không xử lý IPC — các việc đó thuộc file khác.

const { BrowserWindow } = require("electron");
const path = require("path");

// Đường dẫn tới preload và file HTML gốc của renderer.
const PRELOAD_PATH = path.join(__dirname, "preload.js");
const INDEX_HTML_PATH = path.join(
  __dirname,
  "..",
  "dist",
  "workbench",
  "workbench.html",
);

/**
 * Trả về cấu hình BrowserWindow.
 * Tách riêng thành hàm để có thể tái sử dụng (ví dụ: tạo thêm window phụ
 * cho settings, hoặc devtools window) mà không lặp lại cấu hình bảo mật.
 */
function getWindowOptions() {
  return {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false, // không dùng titlebar mặc định của OS, tự vẽ trong workbench
    backgroundColor: "#1e1e1e", // tránh chớp trắng lúc load
    webPreferences: {
      preload: PRELOAD_PATH,
      contextIsolation: true, // bắt buộc: renderer không đụng trực tiếp Node.js
      nodeIntegration: false, // bắt buộc: chặn renderer require() trực tiếp
      sandbox: true,
    },
  };
}

/**
 * Tạo cửa sổ chính của app và load giao diện workbench.
 * Trả về instance BrowserWindow để nơi gọi (index.js) có thể
 * gắn thêm sự kiện nếu cần (ví dụ: on('closed')).
 */
function createWindow() {
  const win = new BrowserWindow(getWindowOptions());
  win.loadFile(INDEX_HTML_PATH);
  return win;
}

module.exports = { createWindow };
