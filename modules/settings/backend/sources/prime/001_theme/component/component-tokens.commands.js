const store = require("./component-tokens.store");
const {
  ALLOWED_SUFFIXES,
  SELECTOR_RE,
  HEX_COLOR_RE,
} = require("./component-tokens.suffixes");

function toCssVar(selector, token) {
  return `--${selector}-${token}`;
}

function validate(selector, token, value) {
  if (!SELECTOR_RE.test(selector))
    throw new Error(
      `selector "${selector}" phải kebab-case, VD: "editor-group"`,
    );
  if (!ALLOWED_SUFFIXES.includes(token))
    throw new Error(
      `token "${token}" không hợp lệ. Cho phép: ${ALLOWED_SUFFIXES.join(", ")}`,
    );
  if (!HEX_COLOR_RE.test(value))
    throw new Error(`value "${value}" phải là mã hex (#rrggbb)`);
}

function setOverride(selector, token, value) {
  validate(selector, token, value);
  const all = store.readOverrides();
  all[selector] = { ...all[selector], [token]: value };
  store.writeOverrides(all);
  return { selector, token, cssVar: toCssVar(selector, token), value };
}

function resetOverride(selector, token) {
  const all = store.readOverrides();
  const removed = [];
  if (all[selector]) {
    if (token) {
      delete all[selector][token];
      removed.push(toCssVar(selector, token));
    } else {
      Object.keys(all[selector]).forEach((t) =>
        removed.push(toCssVar(selector, t)),
      );
      delete all[selector];
    }
    store.writeOverrides(all);
  }
  return { selector, token, removed };
}

// Trả dạng phẳng { "--editor-group-bg": "#xxx" } để apply thẳng vào :root —
// renderer không cần biết cấu trúc lồng nhau selector→token.
function getAllAsCssVars() {
  const all = store.readOverrides();
  const flat = {};
  Object.entries(all).forEach(([selector, tokens]) =>
    Object.entries(tokens).forEach(([token, value]) => {
      flat[toCssVar(selector, token)] = value;
    }),
  );
  return flat;
}

module.exports = { setOverride, resetOverride, getAllAsCssVars };
