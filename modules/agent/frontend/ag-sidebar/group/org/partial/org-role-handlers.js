// org-role-handlers.js
// Trách nhiệm duy nhất: các handler thao tác vai trò (role) — tạo, chọn,
// đổi tên, xoá, context menu. Tách khỏi org-group-handlers.js.

export function makeOrgRoleHandlers(host) {
  return {
    startCreateRole() {
      host.orgCreating = true;
      host.orgNewParentId = "manager";
    },

    setNewRoleParent(parentId) {
      host.orgNewParentId = parentId || null;
    },

    async handleCreateRoleConfirm(e) {
      const name = e.target.value.trim();
      host.orgCreating = false;
      if (!name) return;
      await window.api.org.addRole(name, host.orgNewParentId);
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

    handleRoleRenameStart(id) {
      host.orgMenuOpen = false;
      host.orgEditingId = id;
    },

    async handleRoleRenameConfirm(e, id) {
      const name = e.target.value.trim();
      host.orgEditingId = "";
      const current = host.org?.roles.find((r) => r.id === id);
      if (name && name !== current?.name) {
        await window.api.org.renameRole(id, name);
        window.dispatchEvent(new CustomEvent("org:changed"));
      }
    },

    handleRoleRenameCancel() {
      host.orgEditingId = "";
    },

    async handleRoleDelete(id) {
      host.orgMenuOpen = false;
      if (id === "manager") {
        alert("Không thể xoá vai trò Manager.");
        return;
      }
      if (!window.confirm("Xoá vai trò này?")) return;
      await window.api.org.removeRole(id);
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
