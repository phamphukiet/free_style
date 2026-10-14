// storage.js
// Một tầng key-value: cache RAM, gom ghi (debounce) xuống adapter, phát sự kiện.
// Giá trị phải JSON-serializable; get/entries luôn trả bản sao.

const { createDelayer } = require("./delayer");
const { createPending } = require("./pending");

const clone = (value) => JSON.parse(JSON.stringify(value));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** @typedef {{ adapter: object, flushDelay?: number }} StorageOptions */
function createStorage({ adapter, flushDelay = 100 }) {
  const cache = new Map(Object.entries(adapter.load()));
  const listeners = new Set();
  const pending = createPending();
  const delayer = createDelayer({ delay: flushDelay });
  let inflight = Promise.resolve();
  let closed = false;

  function emit(event) {
    listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("[storage] listener lỗi:", error);
      }
    });
  }

  function applyDelete({ key }) {
    if (!cache.delete(key)) return false;
    pending.remove({ key });
    emit({ key });
    return true;
  }

  function applySet({ key, value }) {
    if (value === undefined || value === null) return applyDelete({ key });
    if (cache.has(key) && same(cache.get(key), value)) return false;
    const stored = clone(value);
    cache.set(key, stored);
    pending.insert({ key, value: stored });
    emit({ key });
    return true;
  }

  function writePending() {
    if (!pending.has()) return inflight;
    const batch = pending.take();
    inflight = Promise.resolve()
      .then(() => adapter.save(batch))
      .catch((error) => {
        pending.restore({ batch });
        throw error;
      });
    return inflight;
  }

  function schedule({ delay } = {}) {
    const promise = delayer.trigger({ task: writePending, delay });
    promise.catch((error) =>
      console.error("[storage] ghi lỗi:", error.message),
    );
    return promise;
  }

  const settle = (changed) => (changed ? schedule() : Promise.resolve());

  const set = ({ key, value }) =>
    closed ? Promise.resolve() : settle(applySet({ key, value }));
  const remove = ({ key }) =>
    closed ? Promise.resolve() : settle(applyDelete({ key }));

  function setMany({ entries }) {
    if (closed) return Promise.resolve();
    const changes = Object.entries(entries).map(([key, value]) =>
      applySet({ key, value }),
    );
    return settle(changes.some(Boolean));
  }

  function flush({ delay } = {}) {
    if (closed) return Promise.resolve();
    return pending.has() ? schedule({ delay }) : inflight;
  }

  function flushSync() {
    delayer.cancel();
    if (!pending.has()) return;
    const batch = pending.take();
    try {
      adapter.saveSync(batch);
    } catch (error) {
      pending.restore({ batch });
      throw error;
    }
  }

  function close() {
    if (closed) return;
    try {
      flushSync();
    } catch (error) {
      console.error("[storage] flush khi đóng lỗi:", error.message);
    }
    closed = true;
    adapter.close();
    listeners.clear();
  }

  function onDidChange({ listener }) {
    listeners.add(listener);
    return { dispose: () => listeners.delete(listener) };
  }

  const get = ({ key, fallback }) =>
    cache.has(key) ? clone(cache.get(key)) : fallback;
  const entries = () =>
    Object.fromEntries([...cache].map(([key, value]) => [key, clone(value)]));

  return {
    get,
    has: ({ key }) => cache.has(key),
    set,
    setMany,
    delete: remove,
    keys: () => [...cache.keys()],
    entries,
    onDidChange,
    flush,
    flushSync,
    close,
  };
}

module.exports = { createStorage };