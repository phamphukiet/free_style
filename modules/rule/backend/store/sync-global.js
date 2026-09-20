// sync-global.js
// Mở project → chép rule global chưa có trong .vibe/rules/ xuống. Không ghi đè bản đã có.

const globalStore = require("./global-store");
const local = require("./local-store");

function syncGlobalRules() {
  if (!local.getProjectPath()) return [];
  const existing = new Set(local.list().map((r) => r.id));
  return globalStore
    .list()
    .filter((g) => !existing.has(g.id))
    .map((g) => {
      local.upsert({ id: g.id, name: g.name, content: g.content });
      return { id: g.id, installed: true };
    });
}

module.exports = { syncGlobalRules };
