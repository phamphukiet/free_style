// _env.js
// Dựng engine settings THẬT bằng node thuần (không cần Electron):
//   • manifest: quét các module đang bật trong modules/active-modules.js
//   • giá trị + mẫu của user: đọc từ ~/.vibe (hoặc VIBE_HOME)
// Chỉ ĐỌC. Chỉ bỏ qua 1 thứ: getTransform (list không dùng effect).

const path = require("path");
const { createRegistry: createStorage } = require("../../../shared/storage");
const { resolveGlobalDir } = require("../../../shared/storage/location/home");
const activeModules = require("../../active-modules.js");
const { createRegistry } = require("../backend/core/registry");
const { createEngine } = require("../backend/core/engine");
const { createSources } = require("../backend/sources");
const { createSettingsTool } = require("../backend/ai/tool");

const MODULES_DIR = path.join(__dirname, "..", "..");

function createWorld() {
  const home = resolveGlobalDir();
  const storage = createStorage({ globalDir: home, followState: false });
  const engine = createEngine({
    registry: createRegistry({
      listSources: createSources({ activeModules, modulesDir: MODULES_DIR }),
    }),
    valuesStore: storage.open({ namespace: "settings", scopes: ["global"] }),
    presetsStore: storage.open({
      namespace: "settings-presets",
      scopes: ["global"],
    }),
    getTransform: () => undefined,
  });

  return {
    home,
    engine,
    tool: createSettingsTool({ engine }),
    cleanup: async () => storage.closeAll(),
  };
}

module.exports = { createWorld };
