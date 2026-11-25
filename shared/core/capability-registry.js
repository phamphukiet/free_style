// Module công bố capability qua đây; module khác chỉ đọc, thiếu/sai hợp đồng -> fallback.
// Khóa theo "kind:id" để cùng 1 id có thể có nhiều kind (service + tool).
const capabilities = new Map();
const keyOf = ({ kind, id }) => `${kind}:${id}`;

function registerCapability(entry) {
  capabilities.set(keyOf(entry), entry);
}

const getCapability = ({ kind, id }) =>
  capabilities.get(keyOf({ kind, id })) || null;

const listCapabilities = ({ kind }) =>
  [...capabilities.values()].filter((entry) => entry.kind === kind);

const satisfies = ({ api, needs }) =>
  needs.every((name) => typeof api?.[name] === "function");

const hasCapability = ({ kind, id }) => capabilities.has(keyOf({ kind, id }));

function getService({ id, needs = [], fallback = null }) {
  const found = getCapability({ kind: "service", id });
  if (!found) return fallback;
  return satisfies({ api: found.api, needs }) ? found.api : fallback;
}

module.exports = {
  registerCapability,
  getCapability,
  listCapabilities,
  hasCapability,
  satisfies,
  getService,
};
