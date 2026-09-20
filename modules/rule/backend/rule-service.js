// rule-service.js
// Nghiệp vụ DUY NHẤT của rule — IPC (UI) và tool-bridge (AI) cùng gọi.
// Global = mẫu dùng mọi project (userData). Local = rule áp dụng thật (.vibe/rules/).
// Mặc định mọi thao tác chỉ đụng local; global chỉ khi truyền { global: true }.

const crypto = require("crypto");
const globalStore = require("./store/global-store");
const local = require("./store/local-store");

const isGlobal = (id) => !!id && !!globalStore.get(id);
const listGlobal = () => globalStore.list();

function list() {
  const globalIds = new Set(globalStore.list().map((g) => g.id));
  return local.list().map((r) => ({ ...r, pinned: globalIds.has(r.id) }));
}

function get(id) {
  const rule = local.get(id);
  return rule ? { ...rule, pinned: isGlobal(id) } : null;
}

// Tìm theo id, tên chính xác, hoặc tên chứa từ khoá (chỉ khi duy nhất → tránh xoá nhầm).
function resolve(key) {
  if (!key) return null;
  const all = local.list();
  const h = key.toLowerCase();
  const exact = all.find((r) => r.id === key || r.name.toLowerCase() === h);
  if (exact) return exact;
  const partial = all.filter((r) => r.name.toLowerCase().includes(h));
  return partial.length === 1 ? partial[0] : null;
}

function save(input, { global = false } = {}) {
  const id = input.id || crypto.randomUUID();
  const rule = local.upsert({ ...input, id });
  if (global) {
    globalStore.upsert({ id, name: rule.name, content: rule.content });
  }
  return get(id);
}

function patch(id, fields) {
  return local.get(id) ? (local.upsert({ ...fields, id }), get(id)) : null;
}

function toggleEnabled(id) {
  const rule = local.get(id);
  return rule ? patch(id, { enabled: !rule.enabled }) : null;
}

const assignAgents = (id, agentIds) => patch(id, { agentIds });

// Ghim = đưa bản local hiện tại lên global; bỏ ghim = xoá khỏi global (local giữ nguyên).
function setGlobal(id, on) {
  const rule = local.get(id);
  if (on && !rule) throw new Error("Rule không có trong project.");
  if (on) globalStore.upsert({ id, name: rule.name, content: rule.content });
  else globalStore.remove(id);
  return get(id);
}

function remove(id, { global = false } = {}) {
  const removed = local.remove(id);
  if (global) globalStore.remove(id);
  return removed;
}

module.exports = {
  isGlobal,
  list,
  listGlobal,
  get,
  resolve,
  save,
  toggleEnabled,
  assignAgents,
  setGlobal,
  remove,
};