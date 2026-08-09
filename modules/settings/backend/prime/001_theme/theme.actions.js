// theme.actions.js
// Action riêng của module theme, được prime/index.js gộp vào tool "settings"
// chung — agent gọi action="create_theme" y hệt action khác, không biết
// có module riêng đứng sau xử lý.

const commands = require("./theme.commands");
const { TOKEN_KEYS } = require("./theme.tokens");

// tokens truyền dạng chuỗi nén "--bg-primary:#112233,--accent:#33ccff" —
// tránh nested object trong tool schema (đỡ token, đỡ lỗi schema với 1 số provider).
function parseTokens(str) {
  if (!str || typeof str !== "string") {
    throw new Error(
      'tokens phải là chuỗi dạng "--bg-primary:#112233,--accent:#33ccff"',
    );
  }
  const tokens = {};
  str.split(",").forEach((pair) => {
    const idx = pair.indexOf(":");
    if (idx === -1) throw new Error(`Cặp token không hợp lệ: "${pair}"`);
    tokens[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
  });
  return tokens;
}

const actions = {
  list_themes: () => ({
    active: commands.getActiveThemeId(),
    items: Object.entries(commands.getAllThemes()).map(([id, t]) => ({
      id,
      label: t.label,
    })),
  }),
  create_theme: (payload) => {
    const theme = commands.createTheme({
      id: payload.id,
      label: payload.label,
      tokens: parseTokens(payload.tokens),
    });
    commands.setActiveTheme(theme.id); // tạo xong thì áp dụng luôn
    return { ...theme, active: true };
  },
  set_theme: (payload) => commands.setActiveTheme(payload.id),
};

function getHint() {
  return (
    `Để tạo theme mới: action="create_theme" với id (kebab-case), label, ` +
    `tokens="key:#hex,key:#hex" — key chỉ được lấy trong: ${TOKEN_KEYS.join(", ")}.`
  );
}

module.exports = { actions, getHint };
