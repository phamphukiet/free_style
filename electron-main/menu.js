// menu.js
// Trách nhiệm duy nhất: dựng native menu (thanh menu hệ điều hành) cho app.
// Không xử lý window hay IPC — các việc đó thuộc file khác.

const { app, Menu } = require("electron");

/**
 * Trả về cấu trúc template cho menu.
 * Tách riêng thành hàm để dễ thêm/sửa mục menu (Debug, Git...) sau này
 * mà không đụng vào lệnh build/set menu bên dưới.
 */
function getMenuTemplate() {
  return [
    {
      label: "File",
      submenu: [{ role: "quit" }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
  ];
}

/**
 * Dựng menu từ template và gắn làm menu chính của app.
 * Gọi hàm này một lần lúc app khởi động (trong index.js).
 */
function buildAppMenu() {
  const menu = Menu.buildFromTemplate(getMenuTemplate());
  Menu.setApplicationMenu(menu);
}

module.exports = { buildAppMenu };
