// Thư mục global của app: ~/.vibe (đối xứng với <project>/.vibe).
// Đổi bằng biến môi trường VIBE_HOME (portable / tách dev-prod / test).
// Không dùng Electron userData.

const os = require("os");
const path = require("path");

const DIR_NAME = ".vibe";

/** @typedef {{ env?: object, homedir?: () => string }} HomeOptions */
function resolveGlobalDir({ env = process.env, homedir = os.homedir } = {}) {
  if (env.VIBE_HOME) return path.resolve(env.VIBE_HOME);
  return path.join(homedir(), DIR_NAME);
}

module.exports = { DIR_NAME, resolveGlobalDir };
