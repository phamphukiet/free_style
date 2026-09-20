// capability-registry.js
// Registry TỔNG QUÁT: module tự đăng ký "khả năng"; nơi dùng (chat...) chỉ hỏi registry,
// không require đường dẫn nội bộ của module khác.
// kind: provider | tool | prompt | exec-wrapper | send-wrapper | service
// requires: mảng "kind:id" — thiếu 1 cái thì capability bị bỏ qua.

const store = new Map(); // "kind:id" -> capability

const keyOf = (kind, id) => `${kind}:${id}`;

function registerCapability(cap) {
  if (!cap || !cap.id || !cap.kind) {
    throw new Error("capability cần có id và kind");
  }
  store.set(keyOf(cap.kind, cap.id), { order: 100, requires: [], ...cap });
}

// Tool cũ dạng tool-bridge.js { getToolSpec, execute(args, ctx) } -> 1 dòng đăng ký.
function registerToolBridge(id, bridge, extra = {}) {
  registerCapability({
    id,
    kind: "tool",
    spec: bridge.getToolSpec(),
    execute: bridge.execute,
    ...extra,
  });
}

const getCapability = (kind, id) => store.get(keyOf(kind, id)) || null;
const hasCapability = (key) => store.has(key);

function listCapabilities(kind) {
  const all = [...store.values()];
  return kind ? all.filter((c) => c.kind === kind) : all;
}

// Khớp provider theo id/alias trong gợi ý tự nhiên ("openai", "gpt"...).
function findProviderByHint(hint) {
  if (!hint) return null;
  const h = hint.toLowerCase();
  const names = (p) => [p.id, ...(p.aliases || [])];
  return (
    listCapabilities("provider").find((p) =>
      names(p).some((n) => h.includes(n)),
    ) || null
  );
}

module.exports = {
  registerCapability,
  registerToolBridge,
  getCapability,
  hasCapability,
  listCapabilities,
  findProviderByHint,
};
