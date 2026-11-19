// Module công bố capability qua đây; module khác chỉ đọc, thiếu/sai hợp đồng -> fallback.
// Khóa theo "kind:id" để cùng 1 id có thể có nhiều kind (service + tool).
const capabilities = new Map();

const keyOf = ({ kind, id }) => `${kind}:${id}`;

const toQuery = (first, second) =>
  typeof first === "string" ? { kind: first, id: second } : first;

function parseKey(text) {
  const at = text.indexOf(":");
  return at < 0 ? null : { kind: text.slice(0, at), id: text.slice(at + 1) };
}

function registerCapability(entry) {
  capabilities.set(keyOf(entry), { requires: [], order: 100, ...entry });
}

const getCapability = (first, second) =>
  capabilities.get(keyOf(toQuery(first, second))) || null;

function listCapabilities(first) {
  const kind = typeof first === "string" ? first : first?.kind;
  return [...capabilities.values()].filter((entry) => entry.kind === kind);
}

const satisfies = ({ api, needs }) =>
  needs.every((name) => typeof api?.[name] === "function");

function getService({ id, needs = [], fallback = null }) {
  const found = getCapability({ kind: "service", id });
  if (!found) return fallback;
  return satisfies({ api: found.api, needs }) ? found.api : fallback;
}

function hasCapability(requirement) {
  const query =
    typeof requirement === "string" ? parseKey(requirement) : requirement;
  return Boolean(query) && capabilities.has(keyOf(query));
}

function findProviderByHint(hint) {
  const wanted = String(hint ?? "")
    .trim()
    .toLowerCase();
  if (!wanted) return null;
  const names = (p) => [p.id, ...(p.aliases ?? [])].map((n) => n.toLowerCase());
  const providers = listCapabilities({ kind: "provider" });
  return (
    providers.find((p) => names(p).includes(wanted)) ??
    providers.find((p) => names(p).some((n) => wanted.includes(n))) ??
    null
  );
}

module.exports = {
  registerCapability,
  getCapability,
  listCapabilities,
  getService,
  hasCapability,
  findProviderByHint,
};
