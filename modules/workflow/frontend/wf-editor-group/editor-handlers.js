export const getEditorHandlers = (host) => ({
  loadDashboard: async () => {
    host.allWorkflows = await window.api.workflow.list();
    host.pinnedWorkflows = await window.api.workflow.listPinned();
  },
  handleSelect: async (e) => {
    const id = e?.detail ? e.detail.id : e;
    const workflow = await window.api.workflow.catalogGet(id);
    if (!workflow) return;
    if (!host.openTabs.some((t) => t.id === workflow.id))
      host.openTabs = [
        ...host.openTabs,
        { id: workflow.id, name: workflow.name },
      ];
    host.activeWorkflowId = workflow.id;
    host.workflow = workflow;
    host.editName = workflow.name;
    host.editDescription = workflow.description || "";
    host.editSteps = workflow.steps || [];
    host.run = null;
  },
  handleSelectTab: async (id) => {
    host.activeWorkflowId = id;
    host.workflow = await window.api.workflow.catalogGet(id);
    host.editName = host.workflow?.name || "";
    host.editDescription = host.workflow?.description || "";
    host.editSteps = host.workflow?.steps || [];
    host.run = null;
  },
  handleCloseTab: (id) => {
    const idx = host.openTabs.findIndex((t) => t.id === id);
    host.openTabs = host.openTabs.filter((t) => t.id !== id);
    if (host.activeWorkflowId !== id) return;
    if (host.openTabs.length === 0) {
      host.activeWorkflowId = "";
      host.workflow = null;
      return;
    }
    const next = host.openTabs[Math.min(idx, host.openTabs.length - 1)];
    host.handleSelectTab(next.id);
  },
  handleGoDashboard: () => {
    host.activeWorkflowId = "";
    host.workflow = null;
  },
  handleCreateNew: async () => {
    if (host._creating) return;
    host._creating = true;
    try {
      const workflow = await window.api.workflow.catalogUpsert({
        name: "Workflow mới",
        description: "",
        steps: [],
      });
      const result = await window.api.workflow.install(workflow);
      if (!result?.installed)
        console.warn(result?.message || "Không thể tự thêm vào project.");
      await host.handleSelect(workflow.id);
      await host.loadDashboard();
      window.dispatchEvent(new CustomEvent("workflows:changed"));
    } finally {
      host._creating = false;
    }
  },
  handleNameInput: (e) => {
    host.editName = e.target.value;
  },
  handleDescriptionInput: (e) => {
    host.editDescription = e.target.value;
  },
  handleAddStep: () => {
    host.editSteps = [
      ...host.editSteps,
      {
        id: `step_${Date.now()}`,
        tool: "rule",
        action: "",
        argsTemplate: {},
        label: "",
      },
    ];
  },
  handleRemoveStep: (i) => {
    host.editSteps = host.editSteps.filter((_, idx) => idx !== i);
  },
  handleStepChange: (i, key, value) => {
    host.editSteps = host.editSteps.map((s, idx) =>
      idx === i ? { ...s, [key]: value } : s,
    );
  },
  handleStepArgsChange: (i, rawJson) => {
    try {
      const parsed = JSON.parse(rawJson);
      host.editSteps = host.editSteps.map((s, idx) =>
        idx === i ? { ...s, argsTemplate: parsed } : s,
      );
    } catch {
      alert("argsTemplate không phải JSON hợp lệ.");
    }
  },
  handleTogglePin: async () => {
    if (!host.workflow) return;
    host.workflow = await window.api.workflow.togglePin(host.workflow.id);
    host.openTabs = host.openTabs.map((t) =>
      t.id === host.workflow.id ? { ...t, name: host.workflow.name } : t,
    );
    await window.api.workflow.syncPinned();
    window.dispatchEvent(new CustomEvent("workflows:changed"));
  },
  handleSave: async () => {
    if (!host.workflow || host.saving) return;
    host.saving = true;
    try {
      host.workflow = await window.api.workflow.catalogUpsert({
        id: host.workflow.id,
        name: host.editName.trim() || "Workflow mới",
        description: host.editDescription,
        steps: host.editSteps,
      });
      host.openTabs = host.openTabs.map((t) =>
        t.id === host.workflow.id ? { ...t, name: host.workflow.name } : t,
      );
      host.saved = true;
      window.dispatchEvent(new CustomEvent("workflows:changed"));
      setTimeout(() => (host.saved = false), 1500);
    } finally {
      host.saving = false;
    }
  },
  handleDelete: async () => {
    if (!host.workflow || host._deleting) return;
    host._deleting = true;
    try {
      if (!window.confirm("Xoá workflow này? Không thể hoàn tác.")) return;
      const id = host.workflow.id;
      await window.api.workflow.catalogDelete(id);
      host.handleCloseTab(id);
      window.dispatchEvent(new CustomEvent("workflows:changed"));
    } finally {
      host._deleting = false;
    }
  },
  handleStartRun: async () => {
    if (!host.workflow) return;
    const { runId } = await window.api.workflow.runCreate(
      host.workflow.id,
      null,
    );
    host.run = await window.api.workflow.runGet(runId);
  },
  handleRunNext: async () => {
    if (!host.run) return;
    const result = await window.api.workflow.runNext(host.run.runId, null);
    host.run = result.run;
  },
});
