// index.js
// Điểm vào backend extension: nối các lớp, đăng ký capability + IPC, khởi động nền.
// Chưa nối vào app: chỉ chạy khi "extension" được bỏ comment trong modules/active-modules.js.

const { app } = require("electron");
const {
  registerCapability,
} = require("../../../shared/core/capability-registry.js");
const { compose } = require("./compose");
const { registerExtensionIpc } = require("./interface/ipc");
const presenter = require("./interface/presenter");

const log = (error) => console.error("[extension]", error.message);

// Chạy sau khi mọi module register() xong, lúc đó service "settings" mới sẵn sàng.
async function boot({ adapters, usecases }) {
  adapters.runner.onCrash({
    listener: (crash) => usecases.handleCrash(crash).catch(log),
  });
  adapters.settings.onChange({
    listener: (event) => usecases.onSettingChanged(event).catch(log),
  });
  adapters.codeStore.watch({
    listener: (event) => usecases.onCodeChanged(event),
  });
  await usecases.sync();
}

function register() {
  const { adapters, usecases } = compose();
  registerCapability({
    id: "extension",
    kind: "setting-source",
    source: adapters.settingSource,
  });
  registerExtensionIpc({ usecases, presenter });
  app.on("before-quit", () => adapters.runner.stopAll());
  setImmediate(() => boot({ adapters, usecases }).catch(log));
}

module.exports = { register };
