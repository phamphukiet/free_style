// project-rules.js
// Ghép manifest (install.js — chỉ có tên file) với catalog (rules-store.js —
// có tên hiển thị) để sidebar hiển thị được tên rule trong project.

const { listInstalled } = require("./install");
const rulesStore = require("../catalog/rules-store");

function listProjectRules() {
  const manifest = listInstalled();
  return Object.entries(manifest).map(([id, info]) => {
    const rule = rulesStore.get(id);
    return {
      id,
      name: rule?.name || id,
      installedAt: info.installedAt,
    };
  });
}

module.exports = { listProjectRules };
