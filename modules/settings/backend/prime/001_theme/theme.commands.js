// theme.commands.js
// Lệnh duy nhất để đọc/tạo/áp theme — cả UI lẫn agent đều đi qua đây.
// Giới hạn cứng: token phải nằm trong whitelist, giá trị phải là mã hex hợp lệ.
// Đây là toàn bộ "bề mặt" mà AI được phép chạm vào cho việc tạo theme.

const { BUILTIN_THEMES } = require("./theme.schema");
const { TOKEN_KEYS, HEX_COLOR_RE } = require("./theme.tokens");
const store = require("./theme.store");
const settingsCommands = require("../../commands");

const THEME_SETTING_ID = "workbench.theme";

function getAllThemes() {
  return { ...BUILTIN_THEMES, ...store.readCustomThemes() };
}

function getThemeOptions() {
  return Object.entries(getAllThemes()).map(([id, t]) => ({
    value: id,
    label: t.label,
  }));
}

function resolveTokens(id) {
  const theme = getAllThemes()[id];
  if (!theme) return BUILTIN_THEMES.dark.tokens;
  return { ...BUILTIN_THEMES.dark.tokens, ...theme.tokens };
}

function getActiveThemeId() {
  return settingsCommands.getValue(THEME_SETTING_ID) || "dark";
}

function getActiveTheme() {
  const id = getActiveThemeId();
  return { id, tokens: resolveTokens(id) };
}

function validateTokens(tokens) {
  if (!tokens || typeof tokens !== "object" || !Object.keys(tokens).length) {
    throw new Error("tokens phải có ít nhất 1 cặp key:value hợp lệ");
  }
  const unknown = Object.keys(tokens).filter((k) => !TOKEN_KEYS.includes(k));
  if (unknown.length) {
    throw new Error(
      `Token không hợp lệ: ${unknown.join(", ")}. Chỉ chấp nhận: ${TOKEN_KEYS.join(", ")}`,
    );
  }
  const badColors = Object.entries(tokens).filter(
    ([, v]) => !HEX_COLOR_RE.test(v),
  );
  if (badColors.length) {
    throw new Error(
      `Giá trị màu không hợp lệ (cần #rrggbb): ${badColors.map(([k]) => k).join(", ")}`,
    );
  }
}

function createTheme({ id, label, tokens }) {
  if (!id || !/^[a-z0-9-]+$/.test(id))
    throw new Error('id theme phải là kebab-case, VD: "ocean-blue"');
  if (BUILTIN_THEMES[id])
    throw new Error(`"${id}" là theme dựng sẵn, không thể ghi đè`);
  if (!label || !label.trim()) throw new Error("label không được rỗng");
  validateTokens(tokens);

  const custom = store.readCustomThemes();
  custom[id] = { label: label.trim(), tokens };
  store.writeCustomThemes(custom);

  syncThemeOptions();
  return { id, label: custom[id].label, tokens: resolveTokens(id) };
}

function setActiveTheme(id) {
  if (!getAllThemes()[id]) throw new Error(`Theme "${id}" không tồn tại`);
  settingsCommands.setValue(THEME_SETTING_ID, id);
  return getActiveTheme();
}

// Đồng bộ lại "options" của setting workbench.theme trong registry chung —
// để UI Settings (dropdown) và tool-spec hint luôn thấy theme mới nhất.
function syncThemeOptions() {
  settingsCommands.registerSetting({
    id: THEME_SETTING_ID,
    group: "Appearance",
    label: "Color Theme",
    description: "Chọn theme màu cho giao diện workbench.",
    type: "enum",
    options: getThemeOptions(),
    default: "dark",
  });
}

module.exports = {
  getAllThemes,
  getActiveTheme,
  getActiveThemeId,
  createTheme,
  setActiveTheme,
  syncThemeOptions,
};
