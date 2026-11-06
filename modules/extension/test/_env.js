// _env.js
// Hạ tầng test (không phải test): trỏ VIBE_HOME vào thư mục tạm để test không đụng ~/.vibe thật.
// PHẢI gọi useTempHome() trước khi require repository (storage chọn thư mục global lúc mở lần đầu).

const fs = require("fs");
const os = require("os");
const path = require("path");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(check, { timeout = 2000, step = 25 } = {}) {
  const end = Date.now() + timeout;
  for (;;) {
    const value = check();
    if (value) return value;
    if (Date.now() > end) throw new Error("waitFor: quá thời gian chờ");
    await sleep(step);
  }
}

const seed = (repo, id) =>
  repo.create({ id, code: require("../backend/runtimes/js").template() });

function useTempHome() {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "vibe-ext-test-"));
  process.env.VIBE_HOME = home;
  const { registry } = require("../../../shared/storage");
  return {
    file: path.join(home, "extensions.json"),
    readSaved: () => {
      try {
        return JSON.parse(fs.readFileSync(path.join(home, "extensions.json"), "utf-8"));
      } catch {
        return null;
      }
    },
    flush: () => registry.find({ namespace: "extensions" })?.store.flush(),
    cleanup: () => {
      registry.closeAll();
      fs.rmSync(home, { recursive: true, force: true });
    },
  };
}

const clearAll = (repo) =>
  Object.keys(repo.all()).forEach((id) => repo.remove({ id }));

module.exports = { useTempHome, clearAll, waitFor, seed };
