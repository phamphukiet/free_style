// index.js
// Trách nhiệm duy nhất: gọi các hàm đăng ký. Logic nằm ở file/ và mention.js.
const { registerFileIpc } = require("./file/ipc");
const { registerEditorMention } = require("./file/mention");

function register() {
  registerFileIpc();
  registerEditorMention();
}

module.exports = { register };
