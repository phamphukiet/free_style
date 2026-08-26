// search-handlers.js
// Trách nhiệm duy nhất: logic tìm kiếm skill + quản lý dropdown platform,
// bao gồm lựa chọn "+ Thêm nền tảng..." luôn nằm cuối dropdown.

export const ADD_PLATFORM_VALUE = "__add_platform__";

export const getSearchHandlers = (host) => ({
  loadPlatforms: async () => {
    host.platforms = await window.api.skill.platformsList();
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
    clearTimeout(host._searchTimer);
    host._searchTimer = setTimeout(() => host.search(), 300);
  },

  handleSortChange: (sortBy) => {
    host.sortBy = sortBy;
    host.search();
  },

  handlePlatformChange: (value) => {
    if (value === ADD_PLATFORM_VALUE) {
      host.addingPlatform = true;
      return;
    }
    host.platformId = value;
    host.search();
  },

  handleAddLinkCancel: () => {
    host.addingPlatform = false;
    host.addLinkUrl = "";
    host.addLinkStatus = "";
  },

  handleAddLinkConfirm: async () => {
    const input = host.addLinkUrl.trim();
    if (!input || host.addLinkLoading) return;

    host.addLinkLoading = true;
    host.addLinkStatus = "";
    const result = await window.api.skill.addPlatform(input);
    host.addLinkLoading = false;

    if (!result?.success) {
      host.addLinkStatus = result?.message || "Không thêm được nền tảng này.";
      return;
    }

    host.addLinkUrl = "";
    host.addingPlatform = false;
    host.loadPlatforms();
  },

  // Icon "Tải" — cài thẳng vào project. Skill có installOptions (cần hỏi
  // thêm) → mở tab chi tiết thay vì cài mù.
  handleQuickInstall: async (item) => {
    if (item.installOptions?.length) {
      host.handleSelect({ detail: { id: item.id } });
      return;
    }
    const result = await window.api.skill.install(item, {});
    if (!result.installed) alert("Cài skill lỗi: " + result.message);
    else window.dispatchEvent(new CustomEvent("skills:changed"));
  },

  // Icon "Xem" — mở trình duyệt ngoài đến trang nguồn skill.
  handleViewSource: (item) => {
    if (item.sourceUrl) window.api.system.openExternal(item.sourceUrl);
  },
});
