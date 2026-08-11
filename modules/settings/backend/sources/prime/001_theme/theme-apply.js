// theme-apply.js
// Áp theme đang active vào :root bằng CSS variables — tự chạy khi module
// settings được nạp. Không phần nào bên ngoài modules/settings cần biết
// đến sự tồn tại của theme; mọi giao tiếp đi qua kênh settings chung.

const THEME_SETTING_ID = "workbench.theme";

function applyTokens(tokens) {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([key, value]) =>
    root.style.setProperty(key, value),
  );
}

async function applyActiveTheme() {
  const { tokens } = await window.api.settings.command("get_active_tokens");
  applyTokens(tokens);
}

function initThemeApply() {
  applyActiveTheme();
  window.api.settings.onChanged((detail) => {
    if (detail.id === THEME_SETTING_ID) applyActiveTheme();
  });
}

initThemeApply();
