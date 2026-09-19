// index.js — entry point DUY NHẤT khi tính năng upload được bật sau này.
// Hiện chưa có processor nào đăng ký -> luôn trả null, an toàn vì chưa có
// UI/IPC upload thật gọi tới đây.

const { loadProcessors } = require("./loader.js");
const { getProcessor } = require("./processor-registry.js");

loadProcessors();

function processAttachment(kind, payload) {
  const processor = getProcessor(kind);
  if (!processor) return null;
  return processor(payload);
}

module.exports = { processAttachment };
