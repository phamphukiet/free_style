// ipc.js
// Đăng ký toàn bộ IPC handler cho module rule. Logic thật nằm ở rules-store /
// install / auto-install / project-rules — file này chỉ forward.

const { ipcMain } = require("electron");
const rulesStore = require("./catalog/rules-store");
const {
  installRule,
  uninstallRule,
  listInstalled,
} = require("./install/install");
const { syncPinnedRules } = require("./install/auto-install");
const { listProjectRules } = require("./install/project-rules");

function registerRuleIpc() {
  ipcMain.handle("rule:list", () => rulesStore.list());
  ipcMain.handle("rule:catalog-get", (e, id) => rulesStore.get(id));
  ipcMain.handle("rule:catalog-upsert", (e, rule) => rulesStore.upsert(rule));
  ipcMain.handle("rule:catalog-delete", (e, id) => {
    rulesStore.remove(id);
    try {
      uninstallRule(id);
    } catch {
      /* chưa mở project, bỏ qua */
    }
    return true;
  });
  ipcMain.handle("rule:assign-agents", (e, id, agentIds) =>
    rulesStore.assignAgents(id, agentIds),
  );
  ipcMain.handle("rule:toggle-pin", (e, id) => rulesStore.togglePin(id));
  ipcMain.handle("rule:toggle-enabled", (e, id) =>
    rulesStore.toggleEnabled(id),
  );
  ipcMain.handle("rule:list-pinned", () => rulesStore.listPinned());
  ipcMain.handle("rule:list-project", () => listProjectRules());
  ipcMain.handle("rule:sync-pinned", () => syncPinnedRules());
  ipcMain.handle("rule:install", (e, rule) => {
    try {
      return installRule(rule);
    } catch (error) {
      return { installed: false, message: error.message };
    }
  });
  ipcMain.handle("rule:uninstall", (e, id) => uninstallRule(id));
}

module.exports = { registerRuleIpc };
