// setting-source.js
// Nguồn setting của ext cho settings module (capability "setting-source").
// Chỉ ext đang BẬT mới có manifest ở đây → tắt ext là setting biến mất. Phần publish/retract của port.

/** @returns {{ source: object, publish: Function, retract: Function }} */
function createSettingSource() {
  const manifests = new Map(); // extId -> manifest đã mở rộng
  const listeners = new Set();
  const notify = () => listeners.forEach((listener) => listener());

  return {
    source: {
      id: "extension",
      trusted: false, // đi qua guard + whitelist target như extension bên thứ ba
      list: () =>
        [...manifests].map(([id, manifest]) => ({ from: id, manifest })),
      onDidChange: ({ listener }) => {
        listeners.add(listener);
        return { dispose: () => listeners.delete(listener) };
      },
    },
    publish: ({ id, manifest }) => {
      manifests.set(id, manifest);
      notify();
    },
    retract: ({ id }) => {
      if (manifests.delete(id)) notify();
    },
  };
}

module.exports = { createSettingSource };
