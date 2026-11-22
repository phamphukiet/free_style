// index.js
// Trách nhiệm duy nhất: gọi các hàm đăng ký. Logic nằm ở file/ và mention.js.
const { registerFileIpc } = require("./file/ipc");
const { registerEditorMention } = require("./file/mention");
const {
  registerCapability,
} = require("../../../shared/core/capability-registry.js");

function register() {
  registerFileIpc();
  registerEditorMention();
  registerCapability({
    id: "editor",
    kind: "mode",
    tab: "explorer",
    order: 20,
  });
}

module.exports = { register };
