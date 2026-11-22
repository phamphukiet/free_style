const { registerMention } = require("../../../shared/core/mention-registry.js");
const {
  registerCapability,
} = require("../../../shared/core/capability-registry.js");
const { getToolSpec, execute } = require("./tool-bridge.js");
const { registerFilesEntities } = require("./entity");

function register() {
  registerFilesEntities();
  registerCapability({ id: "files", kind: "mode", tab: "explorer", order: 10 });
  registerMention("files", { hint: "quản lý tệp tin (tạo/sửa/xoá)" });
}

module.exports = { register };
