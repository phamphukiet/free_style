// index.js
// Nạp toàn bộ provider con trong modules/api/. Thêm provider mới (VD "claude"):
// thêm 1 dòng require ở đây — KHÔNG đụng ipc.js, KHÔNG đụng provider-factory.js.

const fs = require("fs");
const path = require("path");

function register() {
  const keyDir = path.resolve(__dirname, "../key");

  for (const name of fs.readdirSync(keyDir)) {
    const backend = path.join(keyDir, name, "backend", "index.js");

    if (!fs.existsSync(backend)) continue;

    try {
      const module = require(backend);
      if (typeof module.register === "function") {
        module.register();
        console.log(`[api/backend] Provider "${name}" register() OK`);
      }
    } catch (e) {
      console.error(`[api/backend] Provider "${name}" register() LỖI:`, e);
    }
  }
}

module.exports = { register };
