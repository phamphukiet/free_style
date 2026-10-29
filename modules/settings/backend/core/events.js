// events.js
// Theo dõi thay đổi store → so giá trị HIỆU LỰC cũ/mới → phát { ids } (gộp theo microtask).
// Đổi project cũng tự phát vì layered storage phát thay đổi cho mọi key bị ảnh hưởng.

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** @param {{ store: object, effective: ({id}) => any }} deps */
function createEvents({ store, effective }) {
  const listeners = new Set();
  const known = new Map();
  const reloadListeners = new Set();
  let pending = new Set();

  function refresh(id) {
    const next = effective({ id });
    const changed = !same(known.get(id), next);
    known.set(id, next);
    return changed && next !== undefined;
  }

  function notify({ listener, ids }) {
    try {
      listener({ ids });
    } catch (error) {
      console.error("[settings] listener lỗi:", error);
    }
  }

  function flush() {
    const batch = [...pending];
    pending = new Set();
    const ids = batch.filter(refresh);
    if (ids.length > 0)
      listeners.forEach((listener) => notify({ listener, ids }));
  }

  function touch({ id }) {
    if (pending.size === 0) queueMicrotask(flush);
    pending.add(id);
  }

  store.onDidChange({ listener: ({ key }) => touch({ id: key }) });

  return {
    touch,
    onDidChange: ({ listener }) => {
      listeners.add(listener);
      return { dispose: () => listeners.delete(listener) };
    },
    onDidReload: ({ listener }) => {
      reloadListeners.add(listener);
      return { dispose: () => reloadListeners.delete(listener) };
    },
    reloaded: () =>
      reloadListeners.forEach((listener) => notify({ listener, ids: [] })),
  };
}

module.exports = { createEvents };