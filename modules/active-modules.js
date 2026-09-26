// active-modules.js
// Nguồn chân lý DUY NHẤT cho việc bật/tắt module theo id (tên thư mục con
// trong modules/). Đóng băng 1 module: comment đúng dòng id tương ứng.
// Cả main process (ipc.js, ai-tools.js) và renderer (qua IPC modules:active)
// đều đọc từ đây — không sửa ở nơi khác khi bật/tắt.

module.exports = [
  "files",
  "api",
  // "site",
  "chat",
  "editor",
  "providers",
  "terminal",
  "settings",
  "agent",
  "skill",
  // "rule",
  // "kanban",
  "perf",
];
