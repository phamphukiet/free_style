// registry.js
// Gom definition từ mọi source. Build LAZY 1 lần rồi cache.
// Source đứng trước thắng: module (trusted) luôn trước extension → extension
// không thể chiếm owner/id của module.

const { checkManifest } = require("../manifest/guard");

const withDefaults = ({ def, manifest, source }) => ({
  scope: "any",
  aiAccess: "write",
  order: 100,
  tags: [],
  effects: [],
  ...def,
  options: def.options?.map((option) => ({ ...option })),
  owner: manifest.owner,
  origin: source.id,
  builtin: source.trusted,
});

const fail = ({ state, from, error }) => state.errors.push({ from, error });

function addDefinition({ state, def, manifest, source }) {
  if (state.defs.has(def.id)) {
    return fail({ state, from: manifest.owner, error: `${def.id}: id trùng` });
  }
  state.defs.set(def.id, withDefaults({ def, manifest, source }));
}

function acceptManifest({ state, entry, source }) {
  const { from, manifest, error } = entry;
  if (error) return fail({ state, from, error });
  const verdict = checkManifest({ manifest, trusted: source.trusted });
  if (!verdict.ok) return fail({ state, from, error: verdict.error });
  if (state.owners.has(manifest.owner)) {
    return fail({
      state,
      from,
      error: `owner "${manifest.owner}" đã bị chiếm`,
    });
  }
  state.owners.set(manifest.owner, source.id);
  manifest.settings.forEach((def) =>
    addDefinition({ state, def, manifest, source }),
  );
  (manifest.presets || []).forEach((preset) =>
    state.presets.push({ ...preset, from }),
  );
}

function applyPreset({ state, preset }) {
  const { setting, from, ...option } = preset;
  const def = state.defs.get(setting);
  if (!def || def.type !== "select") {
    return fail({
      state,
      from,
      error: `preset "${option.value}": setting đích không hợp lệ`,
    });
  }
  if (def.options.some((o) => o.value === option.value)) {
    return fail({ state, from, error: `preset "${option.value}" trùng value` });
  }
  def.options.push(option);
}

function loadSource({ state, source }) {
  let entries = [];
  try {
    entries = source.list();
  } catch (error) {
    fail({ state, from: source.id, error: error.message });
  }
  entries.forEach((entry) => acceptManifest({ state, entry, source }));
}

/** @param {{ listSources: () => Array<{id:string, trusted:boolean, list:Function}> }} deps */
function createRegistry({ listSources }) {
  let cache = null;

  function build() {
    const state = {
      defs: new Map(),
      owners: new Map(),
      presets: [],
      errors: [],
    };
    listSources().forEach((source) => loadSource({ state, source }));
    state.presets.forEach((preset) => applyPreset({ state, preset }));
    return state;
  }

  const load = () => (cache ??= build());

  return {
    all: () => [...load().defs.values()],
    get: ({ id }) => load().defs.get(id) || null,
    errors: () => load().errors,
    invalidate: () => {
      cache = null;
    },
  };
}

module.exports = { createRegistry };