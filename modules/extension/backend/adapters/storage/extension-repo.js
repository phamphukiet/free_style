// extension-repo.js
// Cài đặt port repository trên shared/storage (namespace "extensions", chỉ tầng global).
// Ghi vào cache RAM ngay, storage tự gom ghi xuống đĩa nên không cần await.

/** @param {{ store: object }} deps  store = registry.open({ namespace: "extensions", scopes: ["global"] }) */
function createExtensionRepo({ store }) {
  return {
    all: () => store.entries(),
    get: ({ id }) => store.get({ key: id, fallback: null }),
    save: ({ id, record }) => {
      store.set({ key: id, value: record });
    },
    remove: ({ id }) => {
      store.delete({ key: id });
    },
  };
}

module.exports = { createExtensionRepo };
