// ipc.js
// Trách nhiệm duy nhất: nối kênh IPC "settings:*" với commands.
// Mọi kết quả bọc { ok, data } / { ok:false, error } — khớp invokeSetting() ở preload.

const { ipcMain } = require("electron");

const asId = (id) => ({ id }); // preload gửi id trần, commands cần object

// channel -> (commands, ...argsTừRenderer) => kết quả
const ROUTES = {
  "settings:list": (c) => c.list(),
  "settings:list-groups": (c) => c.listGroups(),
  "settings:get-all": (c) => c.getAll(),
  "settings:get": (c, id) => c.get(asId(id)),
  "settings:inspect": (c, id) => c.inspect(asId(id)),
  "settings:set": (c, payload) => c.set(payload),
  "settings:reset": (c, payload) => c.reset(payload),
  "settings:add-preset": (c, payload) => c.addPreset(payload),
  "settings:remove-preset": (c, payload) => c.removePreset(payload),
  "settings:get-effects": (c) => c.getEffects(),
  "settings:errors": (c) => c.errors(),
  "settings:import-vscode": (c, opts) => c.importVscode(opts),
  "settings:link-file": (c, opts) => c.linkFile(opts),
  "settings:unlink-file": (c) => c.unlinkFile(),
  "settings:link-status": (c) => c.linkStatus(),
};

function createHandler({ commands, route }) {
  return async (_event, ...args) => {
    try {
      return { ok: true, data: await route(commands, ...args) };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };
}

/** @param {{ commands: object }} deps */
function registerSettingsIpc({ commands }) {
  Object.entries(ROUTES).forEach(([channel, route]) =>
    ipcMain.handle(channel, createHandler({ commands, route })),
  );
}

module.exports = { registerSettingsIpc };