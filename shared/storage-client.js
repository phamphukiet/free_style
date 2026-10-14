// storage-client.js
// Renderer: bọc window.api.storage theo kiểu object hóa + CustomEvent.
// Dùng: const store = openStorage({ namespace: "skills" });

let bridged = false;

function ensureBridge() {
  if (bridged) return;
  bridged = true;
  window.api.storage.onChanged((detail) => {
    window.dispatchEvent(
      new CustomEvent("workbench:storage-changed", { detail }),
    );
  });
}

/** @param {{ namespace: string }} args */
export function openStorage({ namespace }) {
  ensureBridge();
  window.api.storage
    .watch({ namespace })
    .catch((error) => console.warn("[storage-client]", error.message));

  const call =
    (method) =>
    (payload = {}) =>
      window.api.storage[method]({ namespace, ...payload });

  return {
    get: call("get"),
    inspect: call("inspect"),
    set: call("set"),
    delete: call("delete"),
    move: call("move"),
    keys: call("keys"),
    entries: call("entries"),
    onDidChange({ listener }) {
      const handler = (e) => {
        if (e.detail.namespace === namespace) listener(e.detail);
      };
      window.addEventListener("workbench:storage-changed", handler);
      return {
        dispose: () =>
          window.removeEventListener("workbench:storage-changed", handler),
      };
    },
  };
}
