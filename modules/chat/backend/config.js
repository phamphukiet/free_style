// config.js — NƠI DUY NHẤT bật/tắt và chọn chính sách cho chat (Orchestrator).
// Module con vẫn tự đăng ký như thường; chat quyết định có dùng hay không.
module.exports = {
  disabled: [], // id hoặc "kind:id". VD: ["dedupe-cache", "tool:agent", "chatgpt"]
  strategy: "default", // tên strategy trong backend/strategy/
  maxFailures: 3, // lỗi liên tiếp (theo phiên) trước khi ngắt capability
  cooldownMs: 1000, // sau khoảng này cho thử lại (half-open)
};
