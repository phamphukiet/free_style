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
const { registerExtensionEntity } = require("./entity");

function exposeToChat({ usecases }) {
  const list = () => usecases.list().map(presenter.extension);
  const api = {
    list,
    remove: usecases.remove,
    setEnabled: usecases.setEnabled,
  };
  registerCapability({ id: "extension", kind: "service", api });
  registerCapability({
    id: "extension",
    kind: "mode",
    tab: "settings",
    order: 20,
  });
  registerExtensionEntity({ list });
}

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
  registerExtensionIpc({ usecases, presenter });
  exposeToChat({ usecases });
  app.on("before-quit", () => adapters.runner.stopAll());
  setImmediate(() => boot({ adapters, usecases }).catch(log));
}

module.exports = { register };
