// add-link-handler.js
// Trách nhiệm duy nhất: submit form "Thêm nền tảng tìm kiếm" ở dashboard.

export async function submitAddLink(host) {
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
  window.dispatchEvent(new CustomEvent("skills:platforms-changed"));
}
