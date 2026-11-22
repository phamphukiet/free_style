// modes.js: chế độ = tên module đứng đầu (order nhỏ nhất) trong tab. Module tự khai báo qua
// registerCapability({ kind: "mode", id, tab, order }).

const {
  listCapabilities,
} = require("../../../../shared/core/capability-registry.js");

const all = () => listCapabilities({ kind: "mode" });
const inTab = (tab) =>
  all()
    .filter((cap) => cap.tab === tab)
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100));

const modeOfTab = (tab) => inTab(tab)[0]?.id ?? "";
const tabOfMode = (mode) => all().find((cap) => cap.id === mode)?.tab ?? null;

function modulesOfMode(mode) {
  const tab = tabOfMode(mode);
  return tab ? inTab(tab).map((cap) => cap.id) : [];
}

const modeMap = () =>
  Object.fromEntries(
    [...new Set(all().map((c) => c.tab))].map((t) => [t, modeOfTab(t)]),
  );

module.exports = { modulesOfMode, modeMap };
