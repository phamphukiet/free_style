// presets.js
// Mẫu (option) do user/AI thêm cho setting dạng select. Namespace "settings-presets", chỉ global.

function createPresets({ store }) {
  const list = ({ id }) => store.get({ key: id, fallback: [] });
  return {
    list,
    add: ({ id, option }) =>
      store.set({ key: id, value: [...list({ id }), option] }),
    remove: ({ id, value }) =>
      store.set({
        key: id,
        value: list({ id }).filter((o) => o.value !== value),
      }),
  };
}

module.exports = { createPresets };
