// Gộp: logic đọc/tạo/áp theme (commands) + bề mặt action cho AI (actions).
const fs = require("fs");
const path = require("path");
const {
  BUILTIN_THEMES,
  TOKEN_KEYS,
  HEX_COLOR_RE,
  readCustomThemes,
  writeCustomThemes,
} = require("./theme.data");
const settingsCommands = require("../../../core/commands");
const { notifyChanged, notifySchemaChanged } = require("../../../core/notify");

const THEME_SETTING_ID = "workbench.theme";
const TARGET_CSS = path.join(__dirname, "theme.css"); // file đích nằm NGAY trong 001_theme

function getAllThemes() {
  return { ...BUILTIN_THEMES, ...readCustomThemes() };
}
function getThemeOptions() {
  return Object.entries(getAllThemes()).map(([id, t]) => ({
    value: id,
    label: t.label,
  }));
}
function resolveTokens(id) {
  const theme = getAllThemes()[id];
  return { ...BUILTIN_THEMES.dark.tokens, ...(theme ? theme.tokens : {}) };
}
function getActiveThemeId() {
  return settingsCommands.getValue(THEME_SETTING_ID) || "dark";
}
function getActiveTheme() {
  const id = getActiveThemeId();
  return { id, tokens: resolveTokens(id) };
}

// Ghi CSS thật vào theme.css (trong chính 001_theme) — HMR tự áp dụng, không cần JS runtime nữa.
function writeThemeFile(tokens) {
  const body = Object.entries(tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  fs.writeFileSync(
    TARGET_CSS,
    `/* Tự sinh — nội dung sẽ bị ghi đè */\n:root {\n${body}\n}\n`,
    "utf-8",
  );
}

function validateTokens(tokens) {
  if (!tokens || !Object.keys(tokens).length)
    throw new Error("tokens phải có ít nhất 1 cặp key:value hợp lệ");
  const unknown = Object.keys(tokens).filter((k) => !TOKEN_KEYS.includes(k));
  if (unknown.length)
    throw new Error(
      `Token không hợp lệ: ${unknown.join(", ")}. Chỉ chấp nhận: ${TOKEN_KEYS.join(", ")}`,
    );
  const bad = Object.entries(tokens).filter(([, v]) => !HEX_COLOR_RE.test(v));
  if (bad.length)
    throw new Error(
      `Giá trị màu không hợp lệ (cần #rrggbb): ${bad.map(([k]) => k).join(", ")}`,
    );
}

function createTheme({ id, label, tokens }) {
  if (!id || !/^[a-z0-9-]+$/.test(id))
    throw new Error('id theme phải kebab-case, VD: "ocean-blue"');
  if (BUILTIN_THEMES[id])
    throw new Error(`"${id}" là theme dựng sẵn, không thể ghi đè`);
  if (!label?.trim()) throw new Error("label không được rỗng");
  validateTokens(tokens);

  const custom = readCustomThemes();
  custom[id] = { label: label.trim(), tokens };
  writeCustomThemes(custom);
  syncThemeOptions();
  return { id, label: custom[id].label, tokens: resolveTokens(id) };
}

function setActiveTheme(id) {
  if (!getAllThemes()[id]) throw new Error(`Theme "${id}" không tồn tại`);
  settingsCommands.setValue(THEME_SETTING_ID, id);
  writeThemeFile(resolveTokens(id));
  return getActiveTheme();
}

function syncThemeOptions() {
  settingsCommands.registerSetting({
    id: THEME_SETTING_ID,
    group: "Appearance",
    label: "Color Theme",
    description: "Chọn theme màu cho giao diện workbench.",
    type: "enum",
    options: getThemeOptions(),
    default: "dark",
    origin: "prime",
    locked: false,
  });
  writeThemeFile(resolveTokens(getActiveThemeId()));
}

// --- Bề mặt action cho AI/UI gọi qua tool "settings" ---
const actions = {
  list_themes: () => ({
    active: getActiveThemeId(),
    items: Object.entries(getAllThemes()).map(([id, t]) => ({
      id,
      label: t.label,
    })),
  }),
  create_theme: (payload) => {
    const theme = createTheme({
      id: payload.id,
      label: payload.label,
      tokens: parseTokens(payload.tokens),
    });
    setActiveTheme(theme.id);
    notifySchemaChanged({ id: THEME_SETTING_ID });
    notifyChanged(THEME_SETTING_ID, theme.id);
    return { ...theme, active: true };
  },
  set_theme: (payload) => {
    const result = setActiveTheme(payload.id);
    notifyChanged(THEME_SETTING_ID, payload.id);
    return result;
  },
  get_active_tokens: () => getActiveTheme(),
};

function parseTokens(str) {
  if (!str || typeof str !== "string")
    throw new Error(
      'tokens phải là chuỗi dạng "--bg-primary:#112233,--accent:#33ccff"',
    );
  const tokens = {};
  str.split(",").forEach((pair) => {
    const idx = pair.indexOf(":");
    if (idx === -1) throw new Error(`Cặp token không hợp lệ: "${pair}"`);
    tokens[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
  });
  return tokens;
}

function getHint() {
  return `Để tạo theme mới: action="create_theme" id (kebab-case), label, tokens="key:#hex,key:#hex" — key chỉ trong: ${TOKEN_KEYS.join(", ")}.`;
}

module.exports = { syncThemeOptions, actions, getHint };
