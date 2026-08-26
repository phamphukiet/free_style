// platform-handlers.js
// CRUD platform trong dropdown: chọn làm filter, đổi tên, xoá.
// Thêm mới vẫn đi qua handleAddLinkConfirm ở search-handlers.js (backend
// connector.js đã test bằng search thật trước khi lưu).

export const getPlatformHandlers = (host) => ({
  handleTogglePlatformDropdown: () => {
    host.platformDropdownOpen = !host.platformDropdownOpen;
    if (host.platformDropdownOpen) {
      setTimeout(
        () => window.addEventListener("click", host._closePlatformDropdown),
        0,
      );
    } else {
      window.removeEventListener("click", host._closePlatformDropdown);
      host.editingPlatformId = "";
    }
  },

  handleSelectPlatformFilter: (id) => {
    host.platformId = id;
    host.platformDropdownOpen = false;
    window.removeEventListener("click", host._closePlatformDropdown);
    host.search();
  },

  handleOpenAddPlatform: () => {
    host.platformDropdownOpen = false;
    window.removeEventListener("click", host._closePlatformDropdown);
    host.addingPlatform = true;
  },

  handleRenamePlatformStart: async (id) => {
    host.editingPlatformId = id;
    await host.updateComplete;
    host.shadowRoot
      .querySelector(".sk-platform-editing .rename-input")
      ?.focus();
  },

  handleRenamePlatformConfirm: async (e, id) => {
    const name = e.target.value.trim();
    host.editingPlatformId = "";
    const current = host.platforms.find((p) => p.id === id);
    if (name && name !== current?.name) {
      await window.api.skill.platformRename(id, name);
      host.loadPlatforms();
    }
  },

  handleRenamePlatformCancel: () => {
    host.editingPlatformId = "";
  },

  handleDeletePlatform: async (id) => {
    if (!window.confirm("Xoá nền tảng này?")) return;
    await window.api.skill.platformDelete(id);
    if (host.platformId === id) host.platformId = "";
    host.loadPlatforms();
    host.search();
  },
});
