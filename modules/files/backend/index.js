const { registerMention } = require("../../../shared/mention-registry.js");
const {
  registerCapability,
} = require("../../../shared/capability-registry.js");
const { getToolSpec, execute } = require("./tool-bridge.js");

function register() {
  registerCapability({
    id: "files",
    kind: "tool",
    spec: getToolSpec(),
    execute,
  });
  registerMention("files", { hint: "quản lý tệp tin (tạo/sửa/xoá)" });
}

module.exports = { register };
