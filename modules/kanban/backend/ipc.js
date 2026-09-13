// ipc.js
// IPC cho UI — có approve/reject (chỉ dành cho user thật), khác tool-bridge.js (agent).

const { ipcMain } = require("electron");
const boardStore = require("./board/board-store");
const { updateTask } = require("./board/update-task");
const { moveTask } = require("./board/move-task");
const { approveTask } = require("./board/approve-task");
const { rejectTask } = require("./board/reject-task");
const { runTask } = require("./chat/run-task");
const agentStore = require("../../agent/backend/agent/store");

function registerKanbanIpc() {
  ipcMain.handle("kanban:list-tasks", () => boardStore.listTasks());
  ipcMain.handle("kanban:get-task", (e, id) => boardStore.getTask(id));
  ipcMain.handle("kanban:create-task", (e, data) =>
    boardStore.createTask(data),
  );
  ipcMain.handle("kanban:update-task", (e, taskId, patch) =>
    updateTask(taskId, patch),
  );
  ipcMain.handle("kanban:delete-task", (e, taskId) =>
    boardStore.removeTask(taskId),
  );
  ipcMain.handle("kanban:move-task", (e, taskId, toColumnId) =>
    moveTask({ taskId, toColumnId, actor: "user" }),
  );
  ipcMain.handle("kanban:approve-task", (e, taskId) => approveTask(taskId));
    ipcMain.handle("kanban:reject-task", async (e, taskId) => {
      try {
        return await rejectTask(taskId);
      } catch (err) {
        console.error("[ipc] kanban:reject-task lỗi", err.stack || err);
        throw err;
      }
    });
  ipcMain.handle("kanban:run-task", (event, taskId) => {
    const notify = (info) => {
      try {
        event.sender.send("rule:ai-changed", info);
      } catch {}
    };
    return runTask(taskId, notify);
  });
  ipcMain.handle("kanban:list-agents", () => agentStore.list());
}

module.exports = { registerKanbanIpc };
