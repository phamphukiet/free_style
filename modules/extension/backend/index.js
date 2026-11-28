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
const { createLog } = require("../../../shared/log");
const log = createLog({ filename: __filename });
const { registerExtensionEntity } = require("./entity");

function exposeToChat({ usecases }) {
  const list = () => usecases.list().map(presenter.extension);
  const api = {
    list,
    remove: usecases.remove,
    setEnabled: usecases.setEnabled,
    create: usecases.create,
    save: usecases.save,
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
    listener: (crash) =>
      log.say({
        task: "Crash",
        message: `${crash.id}: ${crash.message}`,
        run: () => usecases.handleCrash(crash),
      }),
  });
  adapters.settings.onChange({
    listener: (event) =>
      log.say({
        task: "SettingChanged",
        message: event.ids.join(", "),
        run: () => usecases.onSettingChanged(event),
      }),
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
  setImmediate(() =>
    log.say({ task: "Boot", run: () => boot({ adapters, usecases }) }),
  );
}

module.exports = { register };
