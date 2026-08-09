// prime/index.js
// Tổng hợp mọi prime module (setting dựng sẵn, chỉ ở mức UX/UI, an toàn
// cho AI chỉnh). Thêm prime module mới: tạo thư mục 00X_ten/, export
// {init, actions, getHint}, khai báo ở đây — không sửa settings/backend/commands.js.

const themeCommands = require("./001_theme/theme.commands");
const themeIpc = require("./001_theme/theme.ipc");
const themeActionsModule = require("./001_theme/theme.actions");

const PRIME_MODULES = [
  {
    id: "theme",
    init: () => {
      themeCommands.syncThemeOptions();
      themeIpc.registerThemeIpc();
    },
    actions: themeActionsModule.actions,
    getHint: themeActionsModule.getHint,
  },
];

function initPrimeModules() {
  PRIME_MODULES.forEach((m) => m.init());
}

function getExtraActions() {
  return Object.assign({}, ...PRIME_MODULES.map((m) => m.actions));
}

function getExtraHints() {
  return PRIME_MODULES.map((m) => m.getHint()).join(" ");
}

module.exports = { initPrimeModules, getExtraActions, getExtraHints };
