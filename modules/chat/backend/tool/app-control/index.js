// index.js
// register(): tool "app" + prompt + mention. Chỉ ĐĂNG KÝ, không chứa logic.
// Chuyển app-control sang nơi khác: đổi đường dẫn require bên dưới + chỗ gọi register().

const {
  registerCapability,
} = require("../../../../../shared/core/capability-registry.js");
const {
  registerMention,
} = require("../../../../../shared/core/mention-registry.js");
const { getToolSpec } = require("./spec");
const { execute } = require("./actions");
const { buildPrompt } = require("./prompt");

function register() {
  registerCapability({
    id: "app",
    kind: "tool",
    spec: getToolSpec(),
    execute,
    requires: [], // selector.js đọc cap.requires / cap.order
    order: 50,
  });
  registerCapability({
    id: "app",
    kind: "prompt",
    build: buildPrompt,
    requires: [],
    order: 50,
  });
  registerMention("app", {
    hint: "điều khiển chức năng app qua lệnh của module",
  });
}

module.exports = { register };
