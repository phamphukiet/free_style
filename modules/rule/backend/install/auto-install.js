// auto-install.js
// Tự thêm rule "pinned" nào chưa có trong project — KỂ CẢ khi chưa gán agent
// Ghim là auto-add, gán agent là việc riêng.

const rulesStore = require("../catalog/rules-store");
const { installRule, listInstalled } = require("./install");

function syncPinnedRules() {
  const pinned = rulesStore.listPinned();
  const installed = listInstalled();
  const results = [];
  for (const rule of pinned) {
    if (installed[rule.id]) continue;
    try {
      installRule(rule);
      results.push({ id: rule.id, installed: true });
    } catch (error) {
      results.push({ id: rule.id, installed: false, message: error.message });
    }
  }
  return results;
}

module.exports = { syncPinnedRules };
