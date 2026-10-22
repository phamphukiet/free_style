// theme.js
// "theme.vars": data có sẵn `vars` (built-in) dùng nguyên; data là seed 6 màu (user/AI) thì mở rộng.
// "theme.monacoBase": base sáng/tối cho Monaco (suy từ độ sáng của bg nếu data không khai báo).

const HEX = /^[0-9a-fA-F]{6}$/;
const SEED_KEYS = ["bg", "bgElevated", "text", "textMuted", "accent", "border"];

function assertSeed(seed) {
  const bad = SEED_KEYS.filter((key) => !HEX.test(seed?.[key] ?? ""));
  if (bad.length > 0) throw new Error(`seed thiếu/sai: ${bad.join(", ")}`);
}

function isLightHex(hex) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function seedToVars(seed) {
  const c = (key) => `#${seed[key]}`;
  return {
    "--bg-primary": c("bg"),
    "--bg-secondary": c("bgElevated"),
    "--bg-elevated": c("bgElevated"),
    "--bg-hover": "rgba(255,255,255,0.05)",
    "--text-primary": c("text"),
    "--text-muted": c("textMuted"),
    "--accent": c("accent"),
    "--border": c("border"),
    "--titlebar-bg": c("bgElevated"),
    "--titlebar-text": c("text"),
    "--titlebar-hover": c("bgElevated"),
    "--titlebar-border": c("border"),
    "--activitybar-bg": c("bgElevated"),
    "--activitybar-text": c("textMuted"),
    "--activitybar-hover": c("text"),
    "--activitybar-accent": c("accent"),
    "--sidebar-bg": c("bgElevated"),
    "--sidebar-text": c("text"),
    "--statusbar-bg": c("accent"),
    "--statusbar-text": c("bg"),
    "--rightsidebar-bg": c("bgElevated"),
    "--rightsidebar-text": c("text"),
    "--rightsidebar-border": c("bg"),
    "--panel-bg": c("bg"),
    "--panel-border": c("bgElevated"),
    "--panel-accent": c("accent"),
    "--context-menu-bg": c("bgElevated"),
    "--context-menu-border": c("border"),
    "--context-menu-text": c("text"),
    "--context-menu-hover": c("bgElevated"),
  };
}

function themeVars(data) {
  if (data.vars) return data.vars;
  assertSeed(data);
  return seedToVars(data);
}

function themeMonacoBase(data) {
  if (data.base) return { base: data.base };
  assertSeed(data);
  return { base: isLightHex(data.bg) ? "vs" : "vs-dark" };
}

module.exports = { themeVars, themeMonacoBase };