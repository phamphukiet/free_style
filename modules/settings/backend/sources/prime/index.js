// prime/index.js
// Tổng hợp mọi prime module (setting dựng sẵn, chỉ ở mức UX/UI, an toàn
// cho AI chỉnh). Thêm prime module mới: tạo thư mục 00X_ten/, export
// {init, actions, getHint}, khai báo ở đây — không sửa settings/backend/commands.js.

const theme = require("./001_theme/theme");
const codeLetterCommands = require("./002_code_letter/code-letter.commands");
const save = require("./003_save/save");


const PRIME_MODULES = [
  {
    id: "theme",
    init: () => theme.syncThemeOptions(),
    actions: theme.actions,
    getHint: theme.getHint,
  },
  {
    id: "component-tokens",
    init: () => {},
    actions: theme.componentTokensActions,
    getHint: theme.getComponentTokensHint,
  },
  {
    id: "code-letter",
    init: () => codeLetterCommands.syncCodeLetterOptions(),
    actions: {},
    getHint: () => "",
  },
  {
    id: "save",
    init: () => save.syncSaveOptions(),
    actions: save.actions,
    getHint: save.getHint,
  },
];

function init() {
  PRIME_MODULES.forEach((m) => m.init());
}
function getExtraActions() {
  return Object.assign({}, ...PRIME_MODULES.map((m) => m.actions));
}
function getExtraHints() {
  return PRIME_MODULES.map((m) => m.getHint()).join(" ");
}

module.exports = { init, getExtraActions, getExtraHints };
