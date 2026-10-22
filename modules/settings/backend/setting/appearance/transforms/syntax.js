// syntax.js
// Duyệt bảng màu theo role MỘT lần → rule Monaco + theme xterm. Role lạ / hex sai bị bỏ qua.

const ROLE_MAP = require("./role-map");

const HEX = /^#?[0-9a-fA-F]{6}$/;
const BASES = { light: "vs", dark: "vs-dark" };

function derive(colorMap) {
  const rules = [];
  const terminal = {};
  for (const [role, raw] of Object.entries(colorMap)) {
    const mapping = Object.hasOwn(ROLE_MAP, role) ? ROLE_MAP[role] : null;
    if (!mapping || !HEX.test(String(raw))) continue;
    const hex = String(raw).replace("#", "");
    if (mapping.monaco) rules.push({ token: mapping.monaco, foreground: hex });
    if (mapping.terminal) terminal[mapping.terminal] = `#${hex}`;
  }
  return { rules, terminal };
}

const syntaxMonaco = (data) => ({
  base: BASES[data.base],
  rules: derive(data).rules,
});
const syntaxTerminal = (data) => derive(data).terminal;

module.exports = { syntaxMonaco, syntaxTerminal };
