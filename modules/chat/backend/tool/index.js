// index.js
// Quét tool/*/index.js và gọi register() (cùng kiểu modules/api/backend/index.js).
// Thêm tool của chat = thêm 1 thư mục, không sửa file này.

const fs = require("fs");
const path = require("path");

function registerOne({ name }) {
  const file = path.join(__dirname, name, "index.js");
  if (!fs.existsSync(file)) return;
  try {
    const mod = require(file);
    if (typeof mod.register === "function") mod.register();
  } catch (error) {
    console.error(`[chat/tool] "${name}" register() lỗi:`, error);
  }
}

function register() {
  fs.readdirSync(__dirname, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .forEach((entry) => registerOne({ name: entry.name }));
}

module.exports = { register };
