// module-hook.js
// Hook TUỲ CHỌN của module cho 1 strategy: modules/<id>/backend/strategy/<tên-strategy>.js.
// Không có file → null (strategy dùng mặc định).

const fs = require("fs");
const path = require("path");

const MODULES_DIR = path.resolve(__dirname, "../../../..");
const cache = new Map();

function loadModuleHook(strategyName, moduleId) {
  const key = `${moduleId}:${strategyName}`;
  if (cache.has(key)) return cache.get(key);
  const file = path.join(
    MODULES_DIR,
    moduleId,
    "backend",
    "strategy",
    `${strategyName}.js`,
  );
  let hook = null;
  if (fs.existsSync(file)) {
    try {
      hook = require(file);
    } catch (e) {
      console.error(`[priority] hook ${key} lỗi:`, e.message);
    }
  }
  cache.set(key, hook);
  return hook;
}

module.exports = { loadModuleHook };
