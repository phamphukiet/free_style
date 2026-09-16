// index.js
// Nạp toàn bộ provider con trong modules/api/. Thêm provider mới (VD "claude"):
// thêm 1 dòng require ở đây — KHÔNG đụng ipc.js, KHÔNG đụng provider-factory.js.

function register() {
  require("../key/chatgpt/backend/index.js").register();
  require("../key/gemini/backend/index.js").register();
}

module.exports = { register };
