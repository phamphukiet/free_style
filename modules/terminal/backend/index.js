const { registerTerminalIpc } = require("../../../src/main/ipc/terminal.js");
const { registerMention } = require("../../../shared/mention-registry.js");

function register() {
  registerTerminalIpc();
  registerMention("terminal", { hint: "quản lý terminal (tạo/sửa/xoá)" });
}

module.exports = { register };
