const { ipcMain } = require("electron");
const rulesStore = require("./catalog/rules-store");
const {
  installRule,
  uninstallRule,
  listInstalled,
} = require("./install/install");
const { syncPinnedRules } = require("./install/auto-install");
const { listProjectRules } = require("./install/project-rules");

// Khoá theo id: IPC trùng cho cùng 1 rule trong lúc đang xử lý sẽ bị bỏ qua,
// không phụ thuộc việc phía frontend có gọi trùng hay không.
const pendingIds = new Set();

function registerRuleIpc() {
  ipcMain.handle("rule:list", () => rulesStore.list());
  ipcMain.handle("rule:catalog-get", (e, id) => rulesStore.get(id));
  ipcMain.handle("rule:catalog-upsert", (e, rule) => {
    const saved = rulesStore.upsert(rule);
    try {
      installRule(saved);
    } catch {
      /* chưa mở project, bỏ qua */
    }
    return saved;
  });
  ipcMain.handle("rule:catalog-delete", (e, id) => {
    if (pendingIds.has(id)) return true; // đang xoá rồi, bỏ qua lệnh trùng
    pendingIds.add(id);
    try {
      rulesStore.remove(id);
      try {
        uninstallRule(id);
      } catch {
        /* chưa mở project, bỏ qua */
      }
      return true;
    } finally {
      pendingIds.delete(id);
    }
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
    if (pendingIds.has(rule.id)) {
      return { installed: false, message: "Đang xử lý, bỏ qua lệnh trùng." };
    }
    pendingIds.add(rule.id);
    try {
      return installRule(rule);
    } catch (error) {
      return { installed: false, message: error.message };
    } finally {
      pendingIds.delete(rule.id);
    }
  });

  ipcMain.handle("rule:uninstall", (e, id) => {
    if (pendingIds.has(id)) return false;
    pendingIds.add(id);
    try {
      return uninstallRule(id);
    } finally {
      pendingIds.delete(id);
    }
  });
}

module.exports = { registerRuleIpc };
