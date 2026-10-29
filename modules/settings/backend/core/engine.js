// engine.js
// Ghép registry + values + presets + effects + events thành 1 API. Thuần Node,
// nhận deps qua tham số nên test được mà không cần Electron.

const { validateValue, validateOption } = require("./validate");
const { createValues } = require("./values");
const { createPresets } = require("./presets");
const { createEffects } = require("./effects");
const { createEvents } = require("./events");
const { inspect: resolve } = require("./resolver");

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const WRITE_SCOPES = ["global", "workspace"];

/** @param {{ registry: object, valuesStore: object, presetsStore: object,
 *            getTransform: ({name}) => Function|undefined }} deps */
function createEngine({ registry, valuesStore, presetsStore, getTransform }) {
  const values = createValues({ store: valuesStore });
  const presets = createPresets({ store: presetsStore });
  const effects = createEffects({ getTransform });
  const events = createEvents({ store: valuesStore, effective });

  // Definition + mẫu của user (không cache để mẫu mới có hiệu lực ngay).
  function getDefinition({ id }) {
    const def = registry.get({ id });
    if (!def?.options) return def;
    return { ...def, options: [...def.options, ...presets.list({ id })] };
  }

  function need({ id }) {
    const def = getDefinition({ id });
    if (!def) throw new Error(`Setting "${id}" không tồn tại.`);
    return def;
  }

  function inspectWith({ def, snap }) {
    const layers = {
      global: snap.global[def.id],
      workspace: snap.workspace[def.id],
    };
    return { def, ...resolve({ def, layers }) };
  }

  const inspect = ({ id }) =>
    inspectWith({ def: need({ id }), snap: values.snapshot() });

  function effective({ id }) {
    return getDefinition({ id }) ? inspect({ id }).value : undefined;
  }

  function list() {
    const snap = values.snapshot();
    return registry
      .all()
      .map((d) => inspectWith({ def: getDefinition({ id: d.id }), snap }));
  }

  function set({ id, value, scope = "global" }) {
    const def = need({ id });
    const error = validateValue({ def, value });
    if (error) throw new Error(`${id}: ${error}`);
    if (!WRITE_SCOPES.includes(scope))
      throw new Error(`scope "${scope}" không hợp lệ`);
    const target = def.scope === "global" ? "global" : scope;
    const isDefault = target === "global" && same(value, def.default);
    values.write({ id, value: isDefault ? null : value, scope: target });
    return inspect({ id }).value;
  }

  function reset({ id, scope }) {
    need({ id });
    values.remove({ id, scope });
    return inspect({ id }).value;
  }

  function addPreset({ id, option }) {
    const def = need({ id });
    const error =
      def.type === "select"
        ? validateOption({ option })
        : "chỉ setting select mới có mẫu";
    if (error) throw new Error(`${id}: ${error}`);
    if (def.options.some((o) => o.value === option.value)) {
      throw new Error(`${id}: mẫu "${option.value}" đã tồn tại`);
    }
    const clean = { value: option.value, label: option.label };
    presets.add({
      id,
      option: option.data ? { ...clean, data: option.data } : clean,
    });
    return option.value;
  }

  function removePreset({ id, value }) {
    need({ id });
    if (!presets.list({ id }).some((o) => o.value === value)) {
      throw new Error(`${id}: chỉ xoá được mẫu do người dùng thêm`);
    }
    presets.remove({ id, value });
    events.touch({ id });
    return true;
  }

  function effectsFor({ id, snap = values.snapshot() }) {
    const item = inspectWith({ def: need({ id }), snap });
    return effects.build({ def: item.def, value: item.value });
  }

  function allEffects() {
    const snap = values.snapshot();
    return registry
      .all()
      .filter((d) => d.effects.length > 0)
      .flatMap((d) => effectsFor({ id: d.id, snap }));
  }

  function reload() {
    registry.invalidate();
    registry
      .all()
      .filter((def) => !def.builtin)
      .forEach((def) => events.touch({ id: def.id }));
    events.reloaded();
  }

  return {
    getDefinition,
    list,
    inspect,
    set,
    reset,
    addPreset,
    removePreset,
    effectsFor,
    allEffects,
    errors: registry.errors,
    onDidChange: events.onDidChange,
    reload,
    programs: () => registry.programs(),
    onDidReload: events.onDidReload,
  };
}

module.exports = { createEngine };