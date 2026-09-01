// agent-group-handlers.js
export function makeHandlers(host) {
  return {
    handleSelect(id) {
      host.activeId = id;
      const { setSelectedAgent } = host._agentSelection;
      setSelectedAgent(id);
    },

    async startCreate() {
      host.creating = true;
      await host.updateComplete;
      host.shadowRoot.querySelector(".create-input")?.focus();
    },

    handleCreateConfirm: async (e) => {
      if (!host.creating) return;
      const name = e.target.value.trim();
      host.creating = false;
      if (!name) return;
      const created = await window.api.agent.save({ name });
      window.dispatchEvent(new CustomEvent("agents:changed"));
      makeHandlers(host).handleSelect(created.id);
    },

    handleContextMenu(e, id) {
      e.preventDefault();
      e.stopPropagation();
      host.menuX = e.clientX;
      host.menuY = e.clientY;
      host.menuTargetId = id;
      host.menuOpen = true;
      setTimeout(
        () => window.addEventListener("click", host._handleOutsideClick),
        0,
      );
    },

    async handleRenameStart(id) {
      host.menuOpen = false;
      host.editingId = id;
      await host.updateComplete;
      const input = host.shadowRoot.querySelector(".rename-input");
      input?.focus();
      input?.select();
    },

    handleRenameConfirm: async (e, id) => {
      const name = e.target.value.trim();
      host.editingId = "";
      const current = host.agents.find((a) => a.id === id);
      if (name && name !== current?.name) {
        await window.api.agent.save({ id, name });
        window.dispatchEvent(new CustomEvent("agents:changed"));
      }
    },

    handleRenameCancel() {
      host.editingId = "";
    },

    async handleDelete(id) {
      host.menuOpen = false;
      if (id === "manager") {
        alert("Không thể xoá agent mặc định.");
        return;
      }
      if (!window.confirm("Xoá agent này?")) return;
      await window.api.agent.delete(id);
      if (host.activeId === id) {
        host.activeId = "";
        host._agentSelection.setSelectedAgent("");
      }
      window.dispatchEvent(new CustomEvent("agents:changed"));
    },
  };
}
