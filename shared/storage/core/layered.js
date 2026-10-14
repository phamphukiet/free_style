// layered.js
// Gộp các tầng Storage thành 1 store: đọc workspace > global, ghi theo scope.
// "Ghim" = move({ key, from: "workspace", to: "global" }).

const PRIORITY = ["workspace", "global"]; // gặp trước thắng

/** @typedef {{ scopes: string[], defaultScope: string }} LayeredOptions */
function createLayered({ scopes, defaultScope }) {
  const layers = {}; // scope -> Storage | null (workspace chưa mở project)
  const subs = {};
  const listeners = new Set();

  const active = () => PRIORITY.filter((scope) => layers[scope]);

  function emit(event) {
    listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("[storage] listener lỗi:", error);
      }
    });
  }

  // Gắn/đổi 1 tầng (registry gọi khi đổi project). Báo thay đổi cho mọi key bị ảnh hưởng.
  function setLayer({ scope, storage }) {
    const old = layers[scope];
    const affected = new Set([
      ...(old ? old.keys() : []),
      ...(storage ? storage.keys() : []),
    ]);
    subs[scope]?.dispose();
    old?.close();
    layers[scope] = storage;
    subs[scope] = storage?.onDidChange({
      listener: ({ key }) => emit({ key, scope }),
    });
    affected.forEach((key) => emit({ key, scope }));
  }

  function writable({ scope }) {
    if (scope && !scopes.includes(scope)) {
      throw new Error(`Namespace không hỗ trợ scope "${scope}"`);
    }
    const order = scope ? [scope] : [defaultScope, "global"];
    const target = order.find((s) => layers[s]);
    if (!target) {
      throw new Error(`Scope "${order[0]}" chưa sẵn sàng (chưa mở project?)`);
    }
    return layers[target];
  }

  function inspect({ key }) {
    const scope = active().find((s) => layers[s].has({ key }));
    if (!scope) return { found: false, scope: null, value: undefined };
    return { found: true, scope, value: layers[scope].get({ key }) };
  }

  const get = ({ key, fallback }) => {
    const hit = inspect({ key });
    return hit.found ? hit.value : fallback;
  };

  function remove({ key, scope }) {
    const targets = scope ? [layers[scope]] : active().map((s) => layers[s]);
    return Promise.all(
      targets.filter(Boolean).map((layer) => layer.delete({ key })),
    ).then(() => undefined);
  }

  async function move({ key, from = "workspace", to = "global" }) {
    const source = layers[from];
    if (from === to || !source || !source.has({ key })) return { moved: false };
    await writable({ scope: to }).set({ key, value: source.get({ key }) });
    await source.delete({ key });
    return { moved: true };
  }

  // scope bỏ trống: gộp (global trước, workspace ghi đè). Có scope: chỉ tầng đó.
  function entries({ scope } = {}) {
    const order = scope ? [scope] : [...PRIORITY].reverse();
    return Object.assign(
      {},
      ...order.filter((s) => layers[s]).map((s) => layers[s].entries()),
    );
  }

  function onDidChange({ listener }) {
    listeners.add(listener);
    return { dispose: () => listeners.delete(listener) };
  }

  const each = (fn) => active().map((s) => fn(layers[s]));

  const store = {
    get,
    inspect,
    has: ({ key }) => inspect({ key }).found,
    set: ({ key, value, scope }) => writable({ scope }).set({ key, value }),
    setMany: ({ entries: map, scope }) =>
      writable({ scope }).setMany({ entries: map }),
    delete: remove,
    move,
    keys: ({ scope } = {}) => Object.keys(entries({ scope })),
    entries,
    onDidChange,
    flush: ({ delay } = {}) =>
      Promise.all(each((l) => l.flush({ delay }))).then(() => undefined),
    flushSync: () => each((l) => l.flushSync()),
    close: () => {
      each((l) => l.close());
      listeners.clear();
    },
  };

  return { store, setLayer };
}

module.exports = { createLayered };