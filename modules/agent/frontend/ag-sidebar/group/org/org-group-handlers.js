export function makeOrgHandlers(host) {
  return {
    async loadOrgs() {
      const [orgs, activeOrgId] = await Promise.all([
        window.api.org.list(),
        window.api.org.getActiveId(),
      ]);
      host.activeOrgId = activeOrgId;
      // Org đang active luôn lên đầu.
      host.orgs = orgs
        .slice()
        .sort(
          (a, b) =>
            (b.id === activeOrgId ? 1 : 0) - (a.id === activeOrgId ? 1 : 0),
        );
    },

    handleSelectOrg(id) {
      host.selectedOrgId = id;
      window.dispatchEvent(
        new CustomEvent("org:select-org", { detail: { orgId: id } }),
      );
    },

    handleRequestActivate(id) {
      window.dispatchEvent(
        new CustomEvent("org:activate-preview", { detail: { orgId: id } }),
      );
    },

    toggleOrgSection() {
      host.orgCollapsed = !host.orgCollapsed;
    },

    startCreateOrg() {
      host.orgCreatingOrg = true;
      host.newOrgName = "";
      host.newOrgPresetId = "";
    },
    cancelCreateOrg() {
      host.orgCreatingOrg = false;
    },
    async confirmCreateOrg() {
      const name = host.newOrgName.trim();
      if (!name) return;
      const created = await window.api.org.create(host.newOrgPresetId, name);
      host.orgCreatingOrg = false;
      window.dispatchEvent(new CustomEvent("org:changed"));
      host.handleSelectOrg(created.id);
    },

    async handleDeleteOrg(id) {
      if (!window.confirm("Xoá org này?")) return;
      await window.api.org.delete(id);
      if (host.selectedOrgId === id) {
        host.selectedOrgId = "";
        window.dispatchEvent(
          new CustomEvent("org:select-org", { detail: { orgId: "" } }),
        );
      }
      window.dispatchEvent(new CustomEvent("org:changed"));
    },
  };
}
