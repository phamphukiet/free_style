// ipc.js
// Đăng ký IPC handler cho module workflow. Logic thật ở catalog/install/engine.

const { ipcMain } = require("electron");
const workflowStore = require("./catalog/workflow-store");
const { installWorkflow, uninstallWorkflow } = require("./install/install");
const { syncPinnedWorkflows } = require("./install/auto-install");
const { listProjectWorkflows } = require("./install/project-workflows");
const { runNextStep, getSteps } = require("./engine/run-step");
const runStore = require("./engine/run-store");

function registerWorkflowIpc() {
  ipcMain.handle("workflow:list", () => workflowStore.list());
  ipcMain.handle("workflow:catalog-get", (e, id) => workflowStore.get(id));
  ipcMain.handle("workflow:catalog-upsert", (e, workflow) =>
    workflowStore.upsert(workflow),
  );
  ipcMain.handle("workflow:catalog-delete", (e, id) =>
    workflowStore.remove(id),
  );
  ipcMain.handle("workflow:toggle-pin", (e, id) => workflowStore.togglePin(id));
  ipcMain.handle("workflow:list-pinned", () => workflowStore.listPinned());
  ipcMain.handle("workflow:list-project", () => listProjectWorkflows());
  ipcMain.handle("workflow:sync-pinned", () => syncPinnedWorkflows());

  ipcMain.handle("workflow:install", (e, workflow) => {
    try {
      return installWorkflow(workflow);
    } catch (error) {
      return { installed: false, message: error.message };
    }
  });
  ipcMain.handle("workflow:uninstall", (e, id) => uninstallWorkflow(id));

  ipcMain.handle("workflow:run-create", (e, workflowId, sessionId) => {
    const run = runStore.create(workflowId, sessionId);
    return { runId: run.runId, totalSteps: getSteps(workflowId).length };
  });
  ipcMain.handle("workflow:run-next", (e, runId, agentId) =>
    runNextStep(runId, agentId),
  );
  ipcMain.handle("workflow:run-get", (e, runId) => runStore.get(runId));
}

module.exports = { registerWorkflowIpc };
