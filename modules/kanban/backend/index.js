// index.js
const { registerKanbanIpc } = require("./ipc");
const { registerMention } = require("../../../shared/mention-registry.js");

function register() {
  registerKanbanIpc();
  registerMention("kanban", {
    hint: "quản lý bảng tasks (tạo/sửa/xoá)",
  });
}

module.exports = { register };
