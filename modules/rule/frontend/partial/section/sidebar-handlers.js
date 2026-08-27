export const getSidebarHandlers = (host) => ({
  loadAll: () => {
    host.loadPinned();
    host.loadProject();
  },
  loadPinned: async () => {
    host.pinnedRules = await window.api.rule.listPinned();
  },
  loadProject: async () => {
    host.projectRules = (await window.api.rule.listProject?.()) || [];
  },
  toggleSection: (id) => {
    host.collapsedSections = {
      ...host.collapsedSections,
      [id]: !host.collapsedSections[id],
    };
  },
  handleSelect: (id) => {
    host.selectedId = id;
    window.dispatchEvent(new CustomEvent("rules:select", { detail: { id } }));
  },
});
