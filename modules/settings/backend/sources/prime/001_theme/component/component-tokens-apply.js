// component-tokens-apply.js
const COMPONENT_TOKENS_ID = "workbench.componentTokens"; // xem ghi chú ở component-tokens.actions.js

async function applyAllOverrides() {
  const overrides = await window.api.settings.command("get_component_tokens");
  const root = document.documentElement;
  Object.entries(overrides).forEach(([cssVar, value]) =>
    root.style.setProperty(cssVar, value),
  );
}

function initComponentTokensApply() {
  applyAllOverrides();
  window.api.settings.onChanged((detail) => {
    if (detail.id !== COMPONENT_TOKENS_ID) return;
    // set/reset đều đơn giản nhất là load lại toàn bộ set hiện có —
    // tránh phải tự suy luận việc removeProperty nhiều biến khi reset cả selector.
    applyAllOverrides();
  });
}

initComponentTokensApply();
