// theme-apply.js
// Áp dụng "appearance.theme" cho TOÀN APP: set CSS variable lên :root (đổi màu
// mọi part ngay lập tức, vì các part đã tự dùng var(--xxx, fallback) sẵn) +
// set layer base cho Monaco qua registry chung (không đụng file khác).
// Lưu/khôi phục theme giữa các lần mở app là miễn phí: store.js đã tự ghi
// xuống disk, loader.js luôn trả giá trị đã lưu — apply() chỉ cần đọc đúng
// giá trị hiện tại lúc khởi động.

import { setThemeLayer } from "@shared/monaco-theme.js";

const MONACO_BASE = { dark: "vs-dark", light: "vs", monokai: "vs-dark" };

// Khớp đúng tên biến các part đang dùng (workbench.css, titlebar.css,
// activitybar.css, sidebar.css, statusbar.css, rightsidebar.css, panel...).
const PALETTES = {
  dark: {
    "--bg-primary": "#1e1e1e",
    "--bg-secondary": "#252526",
    "--bg-elevated": "#333333",
    "--bg-hover": "rgba(255,255,255,0.05)",
    "--text-primary": "#cccccc",
    "--text-muted": "#858585",
    "--accent": "#007acc",
    "--border": "#454545",
    "--titlebar-bg": "#252526",
    "--titlebar-text": "#cccccc",
    "--titlebar-hover": "#3a3d41",
    "--titlebar-border": "#3a3d41",
    "--activitybar-bg": "#333333",
    "--activitybar-text": "#858585",
    "--activitybar-hover": "#ffffff",
    "--activitybar-accent": "#007acc",
    "--sidebar-bg": "#252526",
    "--sidebar-text": "#cccccc",
    "--statusbar-bg": "#007acc",
    "--statusbar-text": "#ffffff",
    "--rightsidebar-bg": "#252526",
    "--rightsidebar-text": "#cccccc",
    "--rightsidebar-border": "#1e1e1e",
    "--panel-bg": "#1e1e1e",
    "--panel-border": "#252526",
    "--panel-accent": "#0e70c0",
    "--context-menu-bg": "#1f1f1f",
    "--context-menu-border": "#454545",
    "--context-menu-text": "#cccccc",
    "--context-menu-hover": "#04395e",
  },
  light: {
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#f3f3f3",
    "--bg-elevated": "#e8e8e8",
    "--bg-hover": "rgba(0,0,0,0.05)",
    "--text-primary": "#1e1e1e",
    "--text-muted": "#6b6b6b",
    "--accent": "#0066b8",
    "--border": "#d0d0d0",
    "--titlebar-bg": "#f3f3f3",
    "--titlebar-text": "#1e1e1e",
    "--titlebar-hover": "#e0e0e0",
    "--titlebar-border": "#d0d0d0",
    "--activitybar-bg": "#e8e8e8",
    "--activitybar-text": "#5c5c5c",
    "--activitybar-hover": "#1e1e1e",
    "--activitybar-accent": "#0066b8",
    "--sidebar-bg": "#f3f3f3",
    "--sidebar-text": "#1e1e1e",
    "--statusbar-bg": "#0066b8",
    "--statusbar-text": "#ffffff",
    "--rightsidebar-bg": "#f3f3f3",
    "--rightsidebar-text": "#1e1e1e",
    "--rightsidebar-border": "#d0d0d0",
    "--panel-bg": "#ffffff",
    "--panel-border": "#f3f3f3",
    "--panel-accent": "#0066b8",
    "--context-menu-bg": "#ffffff",
    "--context-menu-border": "#d0d0d0",
    "--context-menu-text": "#1e1e1e",
    "--context-menu-hover": "#cce4f7",
  },
  monokai: {
    "--bg-primary": "#272822",
    "--bg-secondary": "#2d2e27",
    "--bg-elevated": "#3e3d32",
    "--bg-hover": "rgba(255,255,255,0.06)",
    "--text-primary": "#f8f8f2",
    "--text-muted": "#9e9e9e",
    "--accent": "#a6e22e",
    "--border": "#49483e",
    "--titlebar-bg": "#2d2e27",
    "--titlebar-text": "#f8f8f2",
    "--titlebar-hover": "#3e3d32",
    "--titlebar-border": "#49483e",
    "--activitybar-bg": "#2d2e27",
    "--activitybar-text": "#9e9e9e",
    "--activitybar-hover": "#f8f8f2",
    "--activitybar-accent": "#a6e22e",
    "--sidebar-bg": "#2d2e27",
    "--sidebar-text": "#f8f8f2",
    "--statusbar-bg": "#a6e22e",
    "--statusbar-text": "#272822",
    "--rightsidebar-bg": "#2d2e27",
    "--rightsidebar-text": "#f8f8f2",
    "--rightsidebar-border": "#272822",
    "--panel-bg": "#272822",
    "--panel-border": "#2d2e27",
    "--panel-accent": "#a6e22e",
    "--context-menu-bg": "#2d2e27",
    "--context-menu-border": "#49483e",
    "--context-menu-text": "#f8f8f2",
    "--context-menu-hover": "#3e3d32",
  },
};

// Set CSS variable lên :root → mọi part đổi màu NGAY LẬP TỨC (không cần
// reload, không cần part nào tự code lại) vì đã dùng var(--xxx, fallback).
function applyCssVars(themeId) {
  const palette = PALETTES[themeId] || PALETTES.dark;
  const root = document.documentElement.style;
  Object.entries(palette).forEach(([key, value]) =>
    root.setProperty(key, value),
  );
}

function applyMonacoLayer(themeId) {
  setThemeLayer("appearance.theme", {
    base: MONACO_BASE[themeId] || "vs-dark",
  });
}

function applyAll(themeId) {
  applyCssVars(themeId);
  applyMonacoLayer(themeId);
}

// Lúc app khởi động: đọc giá trị ĐÃ LƯU từ lần trước (store.js đã tự persist),
// nên "giữ theme giữa các lần mở app" không cần code thêm gì khác.
async function init() {
  if (!window.api?.settings?.get) return;
  try {
    const themeId = await window.api.settings.get("appearance.theme");
    applyAll(themeId || "dark");
  } catch (e) {
    console.warn("[theme] Không áp dụng được:", e.message);
  }
}

init();

// Đổi theme lúc đang chạy → áp dụng ngay, không đợi reload.
window.api?.settings?.onChanged?.((detail) => {
  if (detail.id !== "appearance.theme") return;
  applyAll(detail.value);
});

export {};
