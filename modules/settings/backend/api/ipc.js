// ipc.js
// Đăng ký settings:* → commands. Luôn trả { ok, data | error }; preload tự bóc lại
// nên chỗ gọi cũ (get/getAll/list) vẫn nhận giá trị thô.

const { ipcMain } = require("electron");

const routes = (c) => ({
  "settings:list": () => c.list(),
  "settings:list-groups": () => c.listGroups(),
  "settings:get-all": () => c.getAll(),
  "settings:get": (id) => c.get({ id }),
  "settings:inspect": (id) => c.inspect({ id }),
  "settings:set": (payload) => c.set(payload),
  "settings:reset": (payload) => c.reset(payload),
  "settings:add-preset": (payload) => c.addPreset(payload),
  "settings:remove-preset": (payload) => c.removePreset(payload),
  "settings:get-effects": () => c.getEffects(),
  "settings:errors": () => c.errors(),
  "settings:import-vscode": (opts) => c.importVscode(opts),
  "settings:link-file": (opts) => c.linkFile(opts),
  "settings:unlink-file": () => c.unlinkFile(),
  "settings:link-status": () => c.linkStatus(),
});

const wrap =
  (handler) =>
  async (event, ...args) => {
    try {
      return { ok: true, data: await handler(...args) };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };

function registerSettingsIpc({ commands }) {
  Object.entries(routes(commands)).forEach(([channel, handler]) =>
    ipcMain.handle(channel, wrap(handler)),
  );
}

module.exports = { registerSettingsIpc };
