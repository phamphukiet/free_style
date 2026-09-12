// editor-handlers.js
function toast(message) {
  window.dispatchEvent(
    new CustomEvent("workbench:toast", { detail: { message } }),
  );
}

export const getEditorHandlers = (host) => ({
  reload: async () => {
    host.tasks = await window.api.kanban.listTasks();
  },
  loadAgents: async () => {
    host.agents = await window.api.kanban.listAgents();
  },
  handleCreateTask: async () => {
    const title = host.newTaskTitle.trim();
    if (!title) return;
    await window.api.kanban.createTask({ title, agentId: host.newTaskAgentId });
    host.newTaskTitle = "";
    await host.reload();
  },
  handleDrop: async (taskId, toColumnId) => {
    if (toColumnId === "done") return; // done chỉ qua nút Duyệt
    const result = await window.api.kanban.moveTask(taskId, toColumnId);
    if (result?.blocked) return toast(result.message);
    await host.reload();
  },
  handleApprove: async (taskId) => {
    try {
      await window.api.kanban.approveTask(taskId);
      await host.reload();
    } catch (error) {
      toast(error.message);
    }
  },
  handleReject: async (taskId, reason) => {
    try {
      await window.api.kanban.rejectTask(taskId, reason);
      await host.reload();
    } catch (error) {
      toast(error.message);
    }
  },
  handleSelectTask: (taskId) => {
    host.selectedTaskId = taskId;
  },
  handleCloseDetail: () => {
    host.selectedTaskId = "";
  },
  toggleALLModal: () => {
    host.showALLModal = !host.showALLModal;
  },
});
