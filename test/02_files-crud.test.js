require("./helpers/electron-bootstrap").ensureElectronMain(__filename);
const { runMultiTurnTest } = require("./helpers/multi-turn-runner");
const { verifyFolderHasFiles } = require("./helpers/fs-assert");

const TEST_CASE = {
  messages: [
    "lập trình folder login",
    "thêm file style.css vào folder login",
    "thêm file index.js vào folder login",
  ],
  agentId: "manager",
  providerId: "gemini",
  keyId: null,
  model: null,
  sessionId: null,
};
const FOLDER_NAME = "login";
const REQUIRED_EXTS = [".css", ".js"];

runMultiTurnTest(TEST_CASE)
  .then((r) => {
    const check = verifyFolderHasFiles(FOLDER_NAME, REQUIRED_EXTS);
    console.log(
      check.ok
        ? `✅ CRUD OK: ${check.message}`
        : `❌ CRUD FAIL: ${check.message}`,
    );
    require("electron").app.exit(r.ok && check.ok ? 0 : 1);
  })
  .catch((err) => {
    console.error("❌ Test lỗi ngoài dự kiến:", err);
    require("electron").app.exit(1);
  });
