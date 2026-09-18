const { app } = require("electron");
const activeModules = require("../../modules/active-modules.js");
const { registerModulesIpc } = require("./ipc/modules-flags.js");
const { registerWindowIpc } = require("./ipc/window.js");
const { registerFsIpc } = require("./ipc/fs.js");
const { registerSystemIpc } = require("./ipc/open_link.js");
const { registerCredentialsIpc } = require("./ipc/credentials/index.js");

function registerWindowIpcWrapper() {
  registerWindowIpc();
  registerFsIpc();
  registerSystemIpc();
  registerCredentialsIpc();
  registerModulesIpc();

  for (const id of activeModules) {
    try {
      const mod = require(`../../modules/${id}/backend/index.js`);
      if (typeof mod.register !== "function") {
        console.warn(`[main/ipc] Module "${id}" không export "register"`);
      } else {
        mod.register();
        // console.log(`[main/ipc] Module "${id}" backend register() OK`);
      }
    } catch (e) {
      console.error(`Failed to load "${id}" backend`, e);
    }
  }
}

module.exports = { registerWindowIpc: registerWindowIpcWrapper };

app.on("before-quit", () => {
  require("../../modules/terminal/backend/terminal").killShell();
});
