// spec.js
// Hằng số hợp đồng của lệnh. COMMAND_DIR là nơi DUY NHẤT biết đường dẫn thư mục lệnh.

const RISKS = ["read", "write", "destructive", "exec"]; // tăng dần theo mức nguy hiểm

module.exports = {
  COMMAND_DIR: ["backend", "setting", "command"],
  RISKS,
  AI_ACCESS: ["none", ...RISKS], // cùng thang với RISKS: vị trí = mức trần AI được chạm tới
  RUN_IN: ["main", "renderer"],
  ARG_TYPES: ["string", "number", "boolean", "object", "array"],
  ID_PATTERN: /^[a-z][a-z0-9-]*\.[A-Za-z][A-Za-z0-9]*$/,
  CHANNEL: Object.freeze({
    announce: "command:announce",
    respond: "command:respond",
    request: "command:request",
  }),
  AI_SWITCH_SETTING: "chat.appControlEnabled", // công tắc tắt khẩn cấp (setting global)
  RENDERER_TIMEOUT_MS: 15_000,
  CONFIRM_TIMEOUT_MS: 120_000,
};
