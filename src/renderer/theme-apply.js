// theme-apply.js
// Áp theme active vào document bằng CSS variables ở :root.
// CSS variable kế thừa xuyên Shadow DOM nên mọi part dùng var(--x) tự đổi màu.

function applyTokens(tokens) {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([key, value]) =>
    root.style.setProperty(key, value),
  );
}

export async function initTheme() {
  const theme = await window.api.settings.theme.getActive();
  applyTokens(theme.tokens);

  window.api.settings.onChanged(async (detail) => {
    if (detail.id !== "workbench.theme") return;
    applyTokens((await window.api.settings.theme.getActive()).tokens);
  });
}
