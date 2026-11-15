const { ipcMain } = require("electron");

const wrap =
  (fn) =>
  async (_event, payload = {}) => {
    try {
      return { ok: true, data: await fn(payload) };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };

/** @param {{ prefix: string, commands: Record<string, Function> }} args */
function registerCommands({ prefix, commands }) {
  Object.entries(commands).forEach(([name, fn]) =>
    ipcMain.handle(`${prefix}:${name}`, wrap(fn)),
  );
}

module.exports = { registerCommands };
