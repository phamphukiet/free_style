// loader.js
// Quét processors/ và require để chúng tự đăng ký. Thư mục có thể chưa tồn
// tại (chưa có processor nào) -> bỏ qua êm, không lỗi.

const fs = require("fs");
const path = require("path");

const PROCESSORS_DIR = path.join(__dirname, "processors");

function loadProcessors() {
  if (!fs.existsSync(PROCESSORS_DIR)) return;
  fs.readdirSync(PROCESSORS_DIR)
    .filter((f) => f.endsWith(".js"))
    .forEach((f) => {
      const file = path.join(PROCESSORS_DIR, f);
      delete require.cache[require.resolve(file)];
      require(file);
    });
}

module.exports = { loadProcessors };
