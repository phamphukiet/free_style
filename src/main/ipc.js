// ipc.js
// Trách nhiệm duy nhất: đăng ký tất cả các IPC handlers.
// Đã được tách nhỏ thành các file trong thư mục ipc/ để đảm bảo rule < 100 dòng.

const activeModules = require("../../modules/active-modules.js");
const { registerModulesIpc } = require("./ipc/modules-flags.js");

function registerWindowIpcWrapper() {
  registerWindowIpc();
  registerFsIpc();
  registerTerminalIpc();
  registerSystemIpc();
  registerCredentialsIpc();
  registerModulesIpc();

  for (const id of activeModules) {
    try {
      require(`../../modules/${id}/backend/index.js`).register?.();
    } catch (e) {
      console.error(`Failed to load "${id}" backend`, e);
    }
  }
}

module.exports = { registerWindowIpc: registerWindowIpcWrapper };

app.on("before-quit", () => {
  require("../../modules/terminal/backend/terminal").killShell();
});
