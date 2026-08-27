export const getEditorHandlers = (host) => ({
  loadDashboard: async () => {
    host.allRules = await window.api.rule.list();
    host.pinnedRules = await window.api.rule.listPinned();
  },
  handleSelect: async (e) => {
    const id = e?.detail ? e.detail.id : e; // hỗ trợ gọi trực tiếp bằng id
    const rule = await window.api.rule.catalogGet(id);
    if (!rule) return;
    if (!host.openTabs.some((t) => t.id === rule.id))
      host.openTabs = [...host.openTabs, { id: rule.id, name: rule.name }];
    host.activeRuleId = rule.id;
    host.rule = rule;
    host.checkedAgentIds = rule.agentIds || [];
    host.editName = rule.name;
    host.editContent = rule.content;
  },
  handleSelectTab: async (id) => {
    host.activeRuleId = id;
    host.rule = await window.api.rule.catalogGet(id);
    host.checkedAgentIds = host.rule?.agentIds || [];
    host.editName = host.rule?.name || "";
    host.editContent = host.rule?.content || "";
  },
  handleCloseTab: (id) => {
    const idx = host.openTabs.findIndex((t) => t.id === id);
    host.openTabs = host.openTabs.filter((t) => t.id !== id);
    if (host.activeRuleId !== id) return;
    if (host.openTabs.length === 0) {
      host.activeRuleId = "";
      host.rule = null;
      return;
    }
    const next = host.openTabs[Math.min(idx, host.openTabs.length - 1)];
    host.handleSelectTab(next.id);
  },
  handleGoDashboard: () => {
    host.activeRuleId = "";
    host.rule = null;
  },
  handleCreateNew: async () => {
    const rule = await window.api.rule.catalogUpsert({
      name: "Rule mới",
      content: "",
    });
    host.loadDashboard();
    host.handleSelect(rule.id);
  },
  handleNameInput: (e) => {
    host.editName = e.target.value;
  },
  handleContentInput: (e) => {
    host.editContent = e.target.value;
  },
  toggleAgent: (id) => {
    host.checkedAgentIds = host.checkedAgentIds.includes(id)
      ? host.checkedAgentIds.filter((a) => a !== id)
      : [...host.checkedAgentIds, id];
  },
  handleTogglePin: async () => {
    if (!host.rule) return;
    host.rule = await window.api.rule.togglePin(host.rule.id);
    host.openTabs = host.openTabs.map((t) =>
      t.id === host.rule.id ? { ...t, name: host.rule.name } : t,
    );
    await window.api.rule.syncPinned();
    window.dispatchEvent(new CustomEvent("rules:changed"));
  },
  handleToggleEnabled: async () => {
    if (!host.rule) return;
    host.rule = await window.api.rule.toggleEnabled(host.rule.id);
  },
  handleSave: async () => {
    if (!host.rule) return;
    host.saving = true;
    host.rule = await window.api.rule.catalogUpsert({
      id: host.rule.id,
      name: host.editName.trim() || "Rule mới",
      content: host.editContent,
      agentIds: host.checkedAgentIds,
    });
    host.openTabs = host.openTabs.map((t) =>
      t.id === host.rule.id ? { ...t, name: host.rule.name } : t,
    );
    host.saving = false;
    host.saved = true;
    window.dispatchEvent(new CustomEvent("rules:changed"));
    setTimeout(() => (host.saved = false), 1500);
  },
  handleDelete: async () => {
    if (!host.rule) return;
    if (!window.confirm("Xoá rule này? Không thể hoàn tác.")) return;
    const id = host.rule.id;
    await window.api.rule.catalogDelete(id);
    host.handleCloseTab(id);
    window.dispatchEvent(new CustomEvent("rules:changed"));
  },
});
