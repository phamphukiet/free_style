export const getSidebarHandlers = (host) => ({
  loadAll: () => {
    host.loadPinned();
    host.loadProject();
  },
  loadPinned: async () => {
    host.pinnedSkills = await window.api.skill.listPinned();
  },
  loadProject: async () => {
    host.projectSkills = (await window.api.skill.listProject?.()) || [];
  },
  toggleSection: (id) => {
    host.collapsedSections = {
      ...host.collapsedSections,
      [id]: !host.collapsedSections[id],
    };
  },
  handleSelect: (id) => {
    host.selectedId = id;
    window.dispatchEvent(new CustomEvent("skills:select", { detail: { id } }));
  },
});
