// index.js
// Điểm export duy nhất. Optional dependency — bị xoá thì nơi gọi (send-handler.js)
// tự fallback dùng executor gốc, không cache, không crash.

const { wrapToolExecutor } = require("./wrap-executor");
module.exports = { wrapToolExecutor };
