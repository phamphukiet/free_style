// Module công bố service qua đây; module khác chỉ đọc, thiếu/sai hợp đồng -> fallback.
const capabilities = new Map();

function registerCapability({ id, kind, api }) {
  capabilities.set(id, { kind, api });
}

const satisfies = ({ api, needs }) =>
  needs.every((name) => typeof api?.[name] === "function");

function getService({ id, needs = [], fallback = null }) {
  const found = capabilities.get(id);
  if (!found || found.kind !== "service") return fallback;
  return satisfies({ api: found.api, needs }) ? found.api : fallback;
}

module.exports = { registerCapability, getService };
