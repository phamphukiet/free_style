export const getSidebarHandlers = (host) => ({
  loadPlatforms: async () => {
    host.platforms = await window.api.skill.platformsList();
  },
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
  search: async () => {
    host.results = await window.api.skill.search(
      host.query,
      host.sortBy,
      host.platformId || null,
    );
  },
  handleQueryInput: (e) => {
    host.query = e.target.value;
    clearTimeout(host._t);
    host._t = setTimeout(() => host.search(), 300);
  },
  handleSortChange: (sortBy) => {
    host.sortBy = sortBy;
    host.search();
  },
  handlePlatformChange: (platformId) => {
    host.platformId = platformId;
    host.search();
  },
  handleSelect: (id) => {
    host.selectedId = id;
    window.dispatchEvent(new CustomEvent("skills:select", { detail: { id } }));
  },
});
