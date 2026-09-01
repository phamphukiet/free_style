// ipc.js
// Trách nhiệm duy nhất: đăng ký IPC handler cho agent. Logic thật ở store.js.

const { ipcMain } = require("electron");
const store = require("../store.js");

function loadOrgGuard() {
  try {
    return require("../org/guard.js");
  } catch {
    return null;
  }
}

function registerAgentIpc() {
  ipcMain.handle("agent:list", () => store.list());
  ipcMain.handle("agent:get", (event, id) => store.get(id));

  ipcMain.handle("agent:save", (event, agent, ctx) => {
    const guard = loadOrgGuard();
    if (guard && ctx?.actorRoleId) {
      if (
        typeof guard.canManageRole !== "function" ||
        !guard.canManageRole(ctx.actorRoleId, ctx.targetRoleId)
      ) {
        throw new Error("Không có quyền quản lý role này theo org.json");
      }
      if (
        !agent.id &&
        (typeof guard.checkMaxCount !== "function" ||
        !guard.checkMaxCount(ctx.targetRoleId))
      ) {
        throw new Error("Đã đạt số lượng tối đa cho role này");
      }
    }
    return store.save(agent);
  });

  ipcMain.handle("agent:delete", (event, id) => store.remove(id));
}

module.exports = { registerAgentIpc };
