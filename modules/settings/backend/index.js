// index.js
// Điểm vào duy nhất của backend settings: dựng engine, nối IPC/service/tool/mention.
// Không chứa logic nghiệp vụ.

const path = require("path");
const { app } = require("electron");
const { registry: storage } = require("../../../shared/storage");
const { loadFeatures } = require("./features");
const capabilities = require("../../../shared/core/capability-registry.js");
const { registerMention } = require("../../../shared/core/mention-registry.js");
const activeModules = require("../../active-modules.js");
const { createRegistry } = require("./core/registry");
const { createEngine } = require("./core/engine");
const { migrateLegacy } = require("./core/migrate-legacy");
const { createSources } = require("./sources");
const { createConnectors } = require("./connectors");
const { createCommands } = require("./api/commands");
const { registerSettingsIpc } = require("./api/ipc");
const { bindBroadcast } = require("./api/broadcast");
const { createSettingsService } = require("./api/service");
const { createSettingsTool } = require("./ai/tool");

let tool = null;

function buildEngine() {
  const sources = createSources({
    activeModules,
    modulesDir: path.join(__dirname, "..", ".."),
  });
  const engine = createEngine({
    registry: createRegistry({ listSources: sources.list }),
    valuesStore: storage.open({ namespace: "settings" }),
    presetsStore: storage.open({
      namespace: "settings-presets",
      scopes: ["global"],
    }),
    getTransform: ({ name }) =>
      getCapability({ kind: "setting-transform", id: name })?.fn,
  });
  return { engine, sources };
}

function register() {
  const { engine, sources } = buildEngine();
  require("./setting").register(); // transform của chính module settings
  const features = loadFeatures({
    ctx: { engine, sources, storage, capabilities },
  });
  app.on("before-quit", features.dispose);
  migrateLegacy({
    file: path.join(app.getPath("userData"), "settings-store.json"),
    set: engine.set,
    addPreset: engine.addPreset,
  });
  const linkStore = storage.open({
    namespace: "settings-links",
    scopes: ["global"],
  });
  const connectors = createConnectors({ engine, store: linkStore });

  registerSettingsIpc({
    commands: createCommands({ engine, connectors }),
    routes: features.routes,
  });
  bindBroadcast({ engine });
  tool = createSettingsTool({ engine });
  registerCapability({
    id: "settings",
    kind: "service",
    api: createSettingsService({ engine }),
  });
  registerCapability({
    id: "settings",
    kind: "tool",
    spec: tool.spec,
    execute: tool.execute,
  });
  registerMention("settings", {
    hint: "quản lý cài đặt (xem/đổi/đặt lại/thêm mẫu)",
  });
  // console.log(
  //   "[settings] defs:",
  //   engine.list().length,
  //   "errors:",
  //   engine.errors(),
  // );
}

// Tương thích chỗ gọi cũ (chat dùng aiBridge.getToolSpec/execute(action, args)).
const aiBridge = {
  getToolSpec: () => tool.getToolSpec(),
  execute: (action, args = {}) => tool.execute({ ...args, action }),
};

module.exports = { register, aiBridge };
