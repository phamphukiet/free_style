// org-handlers.js
export function makeOrgHandlers(host) {
  return {
    async loadOrg() {
      host.org = await window.api.org.get();
    },
    async loadPresets() {
      host.presets = await window.api.org.listPresets();
    },
    toggleOrgSection() {
      host.orgCollapsed = !host.orgCollapsed;
    },

    async handleSelectPreset(presetId) {
      host.org = await window.api.org.selectPreset(presetId);
    },

    startCreateRole() {
      host.orgCreating = true;
      host.orgNewParentId = "manager";
    },
    setNewRoleParent(v) {
      host.orgNewParentId = v || null;
    },
    async handleCreateRoleConfirm(e) {
      if (!host.orgCreating) return;
      const name = e.target.value.trim();
      host.orgCreating = false;
      if (!name) return;
      host.org = await window.api.org.addRole(name, host.orgNewParentId);
      window.dispatchEvent(new CustomEvent("org:changed"));
    },
    cancelCreateRole() {
      host.orgCreating = false;
    },

    handleSelectRole(id) {
      host.selectedRoleId = id;
      window.dispatchEvent(
        new CustomEvent("org:select-role", { detail: { roleId: id } }),
      );
    },

    handleRoleContextMenu(e, id) {
      if (id === "manager") return;
      e.preventDefault();
      e.stopPropagation();
      host.orgMenuX = e.clientX;
      host.orgMenuY = e.clientY;
      host.orgMenuTargetId = id;
      host.orgMenuOpen = true;
      setTimeout(
        () => window.addEventListener("click", host.handleOrgOutsideClick),
        0,
      );
    },
    handleOrgOutsideClick() {
      host.orgMenuOpen = false;
      window.removeEventListener("click", host.handleOrgOutsideClick);
    },

    async handleRoleRenameStart(id) {
      host.orgMenuOpen = false;
      host.orgEditingId = id;
      await host.updateComplete;
      const input = host.shadowRoot.querySelector(".org-rename-input");
      input?.focus();
      input?.select();
    },
    async handleRoleRenameConfirm(e, id) {
      const name = e.target.value.trim();
      host.orgEditingId = "";
      const current = host.org?.roles.find((r) => r.id === id);
      if (name && name !== current?.name) {
        host.org = await window.api.org.renameRole(id, name);
        window.dispatchEvent(new CustomEvent("org:changed"));
      }
    },
    handleRoleRenameCancel() {
      host.orgEditingId = "";
    },

    async handleRoleDelete(id) {
      host.orgMenuOpen = false;
      if (id === "manager") return;
      if (
        !window.confirm(
          "Xoá vai trò này? (Vai trò con / agent đã gán không tự xoá theo)",
        )
      )
        return;
      host.org = await window.api.org.removeRole(id);
      if (host.selectedRoleId === id) {
        host.selectedRoleId = "";
        window.dispatchEvent(
          new CustomEvent("org:select-role", { detail: { roleId: "" } }),
        );
      }
      window.dispatchEvent(new CustomEvent("org:changed"));
    },
  };
}
