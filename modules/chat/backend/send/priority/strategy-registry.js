// strategy-registry.js
// Registry PLUGIN cho chiến lược ưu tiên tool trong chat.
// Mỗi strategy tự gọi registerStrategy() khi được loader nạp.
// Xóa 1 strategy -> xóa file trong strategies/ -> registry tự rỗng entry đó,
// KHÔNG cần sửa file này.

const strategies = []; // [{ name, order, resolve, commit }]

function registerStrategy(name, { resolve, commit, order = 100 }) {
  strategies.push({ name, order, resolve, commit });
}

function getStrategies() {
  return [...strategies].sort((a, b) => a.order - b.order);
}

module.exports = { registerStrategy, getStrategies };
