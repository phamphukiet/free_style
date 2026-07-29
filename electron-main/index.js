// index.js
// Entry point của main process. Trách nhiệm duy nhất: khởi động vòng đời app
// và gọi các hàm setup (window, menu) đúng thời điểm. Không chứa logic UI.

const { app, BrowserWindow } = require("electron");
const { createWindow } = require("./window");
const { buildAppMenu } = require("./menu");

// Giữ tham chiếu window chính để tránh bị garbage collector dọn khi
// không còn biến nào giữ nó (bắt buộc trong Electron).
let mainWindow = null;

/**
 * Khởi tạo app: tạo cửa sổ chính.
 * Tách thành hàm riêng để dễ gọi lại (ví dụ trên macOS khi bấm icon dock
 * lúc chưa có cửa sổ nào mở — xem sự kiện 'activate' bên dưới).
 */
function initApp() {
  mainWindow = createWindow();
}

// App đã sẵn sàng (Electron load xong) → khởi tạo.
app.whenReady().then(() => {
  buildAppMenu();
  initApp();

  // macOS: bấm icon dock khi không có cửa sổ nào → mở lại cửa sổ.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      initApp();
    }
  });
});

// Đóng hết cửa sổ → thoát app, trừ macOS (thông lệ chuẩn của app macOS
// là vẫn chạy nền cho tới khi người dùng Cmd+Q).
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
