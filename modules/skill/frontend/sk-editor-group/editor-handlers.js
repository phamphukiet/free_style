export const getEditorHandlers = (host) => ({
  handleAddLink: () => {
    import("./partial/add-link/add-link-handler.js")
      .then((m) => m.submitAddLink(host))
      .catch(() => console.warn("add-link-handler missing"));
  },
  loadPinned: async () => {
    host.pinnedSkills = await window.api.skill.listPinned();
  },
  handleSelect: async (e) => {
    const skill = await window.api.skill.catalogGet(e.detail.id);
    if (!skill) return;
    if (!host.openTabs.some((t) => t.id === skill.id))
      host.openTabs = [...host.openTabs, { id: skill.id, name: skill.name }];
    host.activeSkillId = skill.id;
    host.skill = skill;
    host.checkedAgentIds = skill.agentIds || [];
    host.showInstallForm = false;
    host.answers = {};
  },
  handleSelectTab: async (id) => {
    host.activeSkillId = id;
    host.skill = await window.api.skill.catalogGet(id);
    host.checkedAgentIds = host.skill?.agentIds || [];
  },
  handleCloseTab: (id) => {
    const idx = host.openTabs.findIndex((t) => t.id === id);
    host.openTabs = host.openTabs.filter((t) => t.id !== id);
    if (host.activeSkillId !== id) return;
    if (host.openTabs.length === 0) {
      host.activeSkillId = "";
      host.skill = null;
      return;
    }
    const next = host.openTabs[Math.min(idx, host.openTabs.length - 1)];
    host.handleSelectTab(next.id);
  },
  handleGoDashboard: () => {
    host.activeSkillId = "";
    host.skill = null;
  },
  handleTogglePin: async () => {
    if (!host.skill) return;
    host.skill = await window.api.skill.togglePin(host.skill.id);
    host.openTabs = host.openTabs.map((t) =>
      t.id === host.skill.id ? { ...t, name: host.skill.name } : t,
    );
    window.dispatchEvent(new CustomEvent("skills:changed"));
  },
  toggleAgent: (id) => {
    host.checkedAgentIds = host.checkedAgentIds.includes(id)
      ? host.checkedAgentIds.filter((a) => a !== id)
      : [...host.checkedAgentIds, id];
  },
  handleSaveAgents: async () => {
    await window.api.skill.assignAgents(host.skill.id, host.checkedAgentIds);
  },
  handleInstallClick: () => {
    if (host.skill?.installOptions?.length) {
      host.showInstallForm = true;
      return;
    }
    host.runInstall({});
  },
  handleAnswerInput: (key, value) => {
    host.answers = { ...host.answers, [key]: value };
  },
  runInstall: async (answers) => {
    host.installing = true;
    const result = await window.api.skill.install(host.skill, answers);
    host.installing = false;
    host.showInstallForm = false;
    if (!result.installed) alert("Cài skill lỗi: " + result.message);
  },
});
