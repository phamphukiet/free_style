// index.js
const { registerRuleIpc } = require("./ipc");
const { registerMention } = require("../../../shared/mention-registry.js");

function register() {
  registerRuleIpc();
  registerMention("rule", {
    hint: "quản lý rule (tạo/sửa/xoá/gán)",
  });
}

module.exports = { register };
