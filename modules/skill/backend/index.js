// index.js
const { registerSkillIpc } = require("./ipc");
const { registerMention } = require("../../../shared/mention-registry.js");

function register() {
  registerSkillIpc();
  registerMention("skill", { hint: "quản lý skill (tạo/sửa/xoá/gán)" });
}

module.exports = { register };
