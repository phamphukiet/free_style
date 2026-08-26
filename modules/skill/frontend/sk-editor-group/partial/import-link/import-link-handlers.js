// import-link-handlers.js
// "Nhập link skill": tải thẳng 1 SKILL.md theo URL người dùng tự tìm bằng
// trình duyệt — không search, không cần platform/adapter. Dùng chung IPC
// skill:install có sẵn. id PHẢI là slug an toàn cho tên thư mục — Windows
// không cho ':' trong path, không được dùng thẳng URL làm id.

function slugFromUrl(url) {
  return (
    url
      .replace(/^https?:\/\//, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "skill"
  );
}

function nameFromUrl(url) {
  const clean = url.split("?")[0].replace(/\/$/, "");
  const last = clean.split("/").filter(Boolean).pop();
  return last?.replace(/\.md$/i, "") || url;
}

export const getImportLinkHandlers = (host) => ({
  handleImportLinkInput: (e) => {
    host.importLinkUrl = e.target.value;
    host.importLinkStatus = "";
  },

  handleImportLinkConfirm: async () => {
    const url = host.importLinkUrl.trim();
    if (!url || host.importLinkLoading) return;

    host.importLinkLoading = true;
    host.importLinkStatus = "";

    const skill = {
      id: slugFromUrl(url),
      name: nameFromUrl(url),
      sourceUrl: url,
      contentUrl: url,
      version: null,
      installOptions: null,
    };

    const result = await window.api.skill.install(skill, {});
    host.importLinkLoading = false;

    if (!result.installed) {
      host.importLinkStatus = "Tải lỗi: " + result.message;
      return;
    }
    host.importLinkUrl = "";
    window.dispatchEvent(new CustomEvent("skills:changed"));
  },
});
