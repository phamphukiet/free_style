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
  handleOpenCreate: () => {
    host.showCreateModal = true;
  },
  handleCloseCreate: () => {
    host.showCreateModal = false;
  },
  handleCreateSubmit: async (detail) => {
    await window.api.kanban.createTask(detail);
    host.showCreateModal = false;
    await host.reload();
  },
  handleFilterChange: (agentId) => {
    host.filterAgentId = agentId;
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
  handleRun: async (taskId) => {
    try {
      await window.api.kanban.runTask(taskId);
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
