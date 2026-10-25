// mention.js
const { registerMention } = require("../../../../shared/core/mention-registry.js");

function registerEditorMention() {
  registerMention("editor", {
    hint: "quản lý trình soạn thảo (tạo/sửa/xoá/run)",
  });
}

module.exports = { registerEditorMention };