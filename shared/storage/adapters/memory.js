// Adapter RAM: dùng cho test và khi không cần lưu đĩa.

const clone = (value) => JSON.parse(JSON.stringify(value));

/** @typedef {{ initial?: object }} MemoryAdapterOptions */
function createMemoryAdapter({ initial = {} } = {}) {
  const data = clone(initial);

  function apply({ insert = {}, remove = [] }) {
    Object.assign(data, insert);
    remove.forEach((key) => delete data[key]);
  }

  return {
    load: () => clone(data),
    save: async (batch) => apply(batch),
    saveSync: (batch) => apply(batch),
    close: () => {},
    snapshot: () => clone(data), // chỉ để test
  };
}

module.exports = { createMemoryAdapter };
