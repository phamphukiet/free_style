// compose.js
// Composition root: tạo adapter thật rồi truyền vào usecase.

const path = require("path");
const { registry } = require("../../../shared/storage");
const { getService } = require("../../../shared/core/capability-registry.js");
const { broadcast } = require("../../../shared/ipc/broadcast.js");
const activeModules = require("../../active-modules.js");
const { createUsecases } = require("./usecases");
const { createExtensionRepo } = require("./adapters/storage/extension-repo");
const { createCodeStore } = require("./adapters/files/code-store");
const { createCodeWatcher } = require("./adapters/files/code-watcher");
const { getRuntime, listRuntimes } = require("./adapters/runtimes");
const { createWorkerRunner } = require("./adapters/worker/worker-runner");
const { scanCommands } = require("./adapters/commands/scan-commands");
const { createCommandBus } = require("./adapters/commands/command-bus");
const { createSettingValues } = require("./adapters/settings/setting-values");
const { createBroadcastChanged } = require("./interface/broadcast");

// owner của settings module (appearance, syntax) không trùng tên module nên khai báo thêm
const RESERVED_OWNERS = ["appearance", "syntax"];

function buildAdapters() {
  const rootDir = path.join(registry.getGlobalDir(), "extensions");
  const modulesDir = path.join(__dirname, "..", "..");
  const commandBus = createCommandBus({
    scan: () => scanCommands({ activeModules, modulesDir }),
    send: broadcast,
  });
  const values = createSettingValues({
    getService,
    store: registry.open({ namespace: "extension-values", scopes: ["global"] }),
  });
  const entries = listRuntimes().map(({ entry }) => entry);

  return {
    commandBus,
    repo: createExtensionRepo({
      store: registry.open({ namespace: "extensions", scopes: ["global"] }),
    }),
    codeStore: {
      ...createCodeStore({ rootDir }),
      ...createCodeWatcher({ rootDir, entries }),
    },
    runner: createWorkerRunner({
      getRuntime,
      commandBus,
      readOwn: values.readOwn,
    }),
    settings: values,
  };
}

function compose() {
  const adapters = buildAdapters();
  const usecases = createUsecases({
    ...adapters,
    broadcast: createBroadcastChanged({ broadcast }),
    reserved: new Set([...activeModules, ...RESERVED_OWNERS]),
  });
  return { adapters, usecases };
}

module.exports = { compose };
