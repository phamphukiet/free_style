// loader.js
// Quét toàn bộ file trong strategies/ và require để chúng tự đăng ký vào
// strategy-registry.js. Thêm/xóa 1 strategy -> KHÔNG cần sửa file này.

const fs = require("fs");
const path = require("path");

const STRATEGIES_DIR = path.join(__dirname, "strategies");

function loadStrategies() {
  if (!fs.existsSync(STRATEGIES_DIR)) return;
  fs.readdirSync(STRATEGIES_DIR)
    .filter((f) => f.endsWith(".js"))
    .forEach((f) => {
      const file = path.join(STRATEGIES_DIR, f);
      delete require.cache[require.resolve(file)];
      require(file);
    });
}

module.exports = { loadStrategies };