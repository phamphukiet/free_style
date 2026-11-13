// mode-banner-mount.js
// Nghe sự kiện chế độ, gắn/gỡ dải vào shadow root của module-sidebar mà không sửa sidebar.js.
// MutationObserver giữ dải còn nguyên khi sidebar bị mount lại (đổi tab rồi quay về).

import "./mode-banner.js";

const MODE_EVENT = "workbench:explorer-mode"; // detail: { active, label? }

let mode = { active: false, label: "" };

const sidebarHost = () =>
  document.querySelector("workbench-sidebar")?.shadowRoot;
const explorerRoot = () =>
  sidebarHost()?.querySelector("module-sidebar")?.shadowRoot;

function sync() {
  const root = explorerRoot();
  if (!root) return;
  const banner = root.querySelector("ed-mode-banner");
  if (!mode.active) return banner?.remove();
  if (banner) {
    banner.label = mode.label;
    return;
  }
  const el = document.createElement("ed-mode-banner");
  el.label = mode.label;
  root.prepend(el);
}

window.addEventListener(MODE_EVENT, (e) => {
  mode = { label: "", ...e.detail };
  sync();
});

const host = sidebarHost();
if (host)
  new MutationObserver(sync).observe(host, { childList: true, subtree: true });
