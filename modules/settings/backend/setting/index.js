// index.js
// Đăng ký các hàm biến đổi (capability "setting-transform") mà setting của module này dùng.

const {
  registerCapability,
} = require("../../../../shared/capability-registry.js");
const { themeVars, themeMonacoBase } = require("./appearance/transforms/theme");
const {
  syntaxMonaco,
  syntaxTerminal,
} = require("./appearance/transforms/syntax");

const TRANSFORMS = {
  "theme.vars": themeVars,
  "theme.monacoBase": themeMonacoBase,
  "syntax.monaco": syntaxMonaco,
  "syntax.terminal": syntaxTerminal,
};

function register() {
  Object.entries(TRANSFORMS).forEach(([id, fn]) =>
    registerCapability({ id, kind: "setting-transform", fn }),
  );
}

module.exports = { register };
