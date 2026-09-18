// index.js
// Điểm export duy nhất — src/main/ipc.js chỉ cần gọi registerSettingsBackend().

const { registerSettingsIpc } = require("./ipc");
const aiBridge = require("./ai-bridge");
const { loadRootAiExtensions } = require("./loader");
const { registerMention } = require("../../../shared/mention-registry.js");

function register() {
  registerSettingsIpc();
  loadRootAiExtensions();
  registerMention("settings", {
    hint: "quản lý cài đặt (tạo/sửa/xoá/bật tắt)",
  });
}

module.exports = { register, aiBridge };
