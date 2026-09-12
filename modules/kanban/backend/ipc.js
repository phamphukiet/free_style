// ipc.js
// IPC cho UI — có approve/reject (chỉ dành cho user thật), khác tool-bridge.js (agent).

const { ipcMain } = require("electron");
const boardStore = require("./board-store");
const { moveTask } = require("./move-task");
const { approveTask } = require("./approve-task");
const { rejectTask } = require("./reject-task");
const { getMessages, appendMessage } = require("./chat-store");
const { replyAsAgent } = require("./agent-reply");
const agentStore = require("../../agent/backend/agent/store");

function registerKanbanIpc() {
  ipcMain.handle("kanban:list-tasks", () => boardStore.listTasks());
  ipcMain.handle("kanban:get-task", (e, id) => boardStore.getTask(id));
  ipcMain.handle("kanban:create-task", (e, data) =>
    boardStore.createTask(data),
  );

  ipcMain.handle("kanban:move-task", (e, taskId, toColumnId) =>
    moveTask({ taskId, toColumnId, actor: "user" }),
  );
  ipcMain.handle("kanban:approve-task", (e, taskId) => approveTask(taskId));
  ipcMain.handle("kanban:reject-task", (e, taskId, reason) =>
    rejectTask(taskId, reason),
  );

  ipcMain.handle("kanban:chat-list", (e, taskId) => getMessages(taskId));
  ipcMain.handle("kanban:chat-send", async (e, taskId, content) => {
    appendMessage(taskId, { role: "user", content });
    const task = boardStore.getTask(taskId);
    if (task?.agentId) {
      try {
        await replyAsAgent(task);
      } catch (error) {
        appendMessage(taskId, {
          role: "assistant",
          content: `Lỗi: ${error.message}`,
        });
      }
    }
    return getMessages(taskId);
  });

  ipcMain.handle("kanban:list-agents", () => agentStore.list());
}

module.exports = { registerKanbanIpc };
