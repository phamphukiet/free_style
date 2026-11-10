// _env.js
// Hạ tầng test (không phải test): dựng "thế giới thu nhỏ" cho extension, chạy bằng node thuần.
// Dùng ĐỒ THẬT: repo, file code, worker, command bus, setting source.
// Chỉ giả 3 thứ cần Electron/UI:
//   • ~/.vibe                → thư mục tạm
//   • engine của Settings    → settings giả, có hàm choose() = "user chọn trong Settings"
//   • gửi lệnh cho renderer  → ghi vào mảng commandsSent để test kiểm tra

const fs = require("fs");
const os = require("os");
const path = require("path");
const { createRegistry } = require("../../../shared/storage");
const activeModules = require("../../active-modules.js");
const { createUsecases } = require("../backend/usecases");
const {
  createExtensionRepo,
} = require("../backend/adapters/storage/extension-repo");
const { createCodeStore } = require("../backend/adapters/files/code-store");
const { getRuntime } = require("../backend/adapters/runtimes");
const {
  createWorkerRunner,
} = require("../backend/adapters/worker/worker-runner");
const { scanCommands } = require("../backend/adapters/commands/scan-commands");
const {
  createCommandBus,
} = require("../backend/adapters/commands/command-bus");
const {
  createSettingSource,
} = require("../backend/adapters/settings/setting-source");
const {
  createSettingValues,
} = require("../backend/adapters/settings/setting-values");
const presenter = require("../backend/interface/presenter");

const MODULES_DIR = path.join(__dirname, "..", "..");
const log = (error) => console.error("  (log)", error.message);

// Settings giả: chỉ có 2 hàm ext dùng (get, onDidChange) + choose().
function createFakeSettings() {
  const values = {};
  const listeners = new Set();
  return {
    api: {
      get: ({ id, fallback }) =>
        Object.hasOwn(values, id) ? values[id] : fallback,
      onDidChange: ({ listener }) => {
        listeners.add(listener);
        return { dispose: () => listeners.delete(listener) };
      },
    },
    // Xong khi ext đã chạy lại với giá trị mới.
    choose: async ({ id, value }) => {
      values[id] = value;
      await Promise.all(
        [...listeners].map((listener) => listener({ ids: [id] })),
      );
    },
  };
}

function createWorld() {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "vibe-ext-test-"));
  const registry = createRegistry({ globalDir: home, followState: false });
  const fake = createFakeSettings();
  const settingSource = createSettingSource();
  const commandsSent = [];
  let changes = 0;

  const commandBus = createCommandBus({
    scan: () => scanCommands({ activeModules, modulesDir: MODULES_DIR }),
    send: ({ channel, payload }) =>
      commandsSent.push({ channel, ...payload, at: Date.now() }),
  });
  const values = createSettingValues({
    getService: () => fake.api,
    openStore: () =>
      registry.open({ namespace: "settings", scopes: ["global"] }),
  });
  const runner = createWorkerRunner({ getRuntime, commandBus });
  const usecases = createUsecases({
    repo: createExtensionRepo({
      store: registry.open({ namespace: "extensions", scopes: ["global"] }),
    }),
    codeStore: createCodeStore({ rootDir: path.join(home, "extensions") }),
    runner,
    settings: {
      ...values,
      publish: settingSource.publish,
      retract: settingSource.retract,
    },
    commandBus,
    broadcast: () => {
      changes++;
    },
    reserved: new Set([...activeModules, "appearance", "syntax"]),
  });
  runner.onCrash({
    listener: (crash) => usecases.handleCrash(crash).catch(log),
  });
  values.onChange({
    listener: (event) => usecases.onSettingChanged(event).catch(log),
  });

  return {
    usecases,
    source: settingSource.source,
    settings: fake,
    commandsSent,
    changes: () => changes,
    view: (id) =>
      presenter.extension(usecases.list().find((row) => row.id === id)),
    async cleanup({ keep }) {
      await runner.stopAll();
      registry.closeAll();
      if (keep) return console.log(`\n📁 Thư mục tạm: ${home}`);
      fs.rmSync(home, { recursive: true, force: true });
    },
  };
}

module.exports = { createWorld };
