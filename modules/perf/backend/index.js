const config = require("./config");

function register() {
  for (const id of config) {
    try {
      require(`../level/${id}`).register();
    } catch (e) {
      console.error(`[perf] Level "${id}" register() lỗi:`, e);
    }
  }
}

module.exports = { register };
