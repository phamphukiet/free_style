// commands.js
// Nghiệp vụ settings dạng view-model cho UI. Logic thật ở core/engine.

const FIELDS = [
  "id",
  "group",
  "label",
  "type",
  "description",
  "tags",
  "min",
  "max",
  "order",
  "scope",
  "owner",
  "origin",
];

const byOrder = (a, b) =>
  a.def.order - b.def.order || a.def.label.localeCompare(b.def.label);

// options bỏ `data` (nặng, UI không cần).
function toItem({ def, value, scope, global, workspace }) {
  const base = Object.fromEntries(FIELDS.map((key) => [key, def[key]]));
  return {
    ...base,
    hint: def.aiHint,
    default: def.default,
    options: def.options?.map((o) => ({ value: o.value, label: o.label })),
    value,
    source: scope,
    modified: scope !== "default",
    global,
    workspace,
  };
}

/** @param {{ engine: object, connectors: object }} deps */
function createCommands({ engine, connectors }) {
  const sorted = () => engine.list().sort(byOrder);
  return {
    list: () => sorted().map(toItem),
    listGroups: () => [...new Set(sorted().map(({ def }) => def.group))],
    getAll: () =>
      Object.fromEntries(engine.list().map((i) => [i.def.id, i.value])),
    get: ({ id }) => engine.inspect({ id }).value,
    inspect: ({ id }) => toItem(engine.inspect({ id })),
    set: (payload) => engine.set(payload),
    reset: (payload) => engine.reset(payload),
    addPreset: (payload) => engine.addPreset(payload),
    removePreset: (payload) => engine.removePreset(payload),
    getEffects: () => engine.allEffects(),
    errors: () => engine.errors(),
    importVscode: (opts) => connectors.importVscode(opts),
    linkFile: (opts) => connectors.linkFile(opts),
    unlinkFile: () => connectors.unlinkFile(),
    linkStatus: () => connectors.linkStatus(),
  };
}

module.exports = { createCommands };
