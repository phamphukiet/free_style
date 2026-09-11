export const getSidebarHandlers = (host) => ({
  loadAll: () => {
    host.loadPinned();
    host.loadProject();
  },
  loadPinned: async () => {
    host.pinnedWorkflows = await window.api.workflow.listPinned();
  },
  loadProject: async () => {
    host.projectWorkflows = (await window.api.workflow.listProject?.()) || [];
  },
  toggleSection: (id) => {
    host.collapsedSections = {
      ...host.collapsedSections,
      [id]: !host.collapsedSections[id],
    };
  },
  handleSelect: (id) => {
    host.selectedId = id;
    window.dispatchEvent(
      new CustomEvent("workflows:select", { detail: { id } }),
    );
  },
});
