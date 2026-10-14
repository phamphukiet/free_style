// Bảng handler storage:*. Chỉ namespace mở với `expose: true` mới truy cập được.
// Nhận registry + broadcast qua tham số để test không cần Electron.

/** @param {{ registry: object, broadcast: (arg: { payload: object }) => void }} deps */
function createHandlers({ registry, broadcast }) {
  const watching = new Map(); // namespace -> { dispose }

  function exposed({ namespace }) {
    const found = registry.find({ namespace });
    if (!found || !found.options.expose) {
      throw new Error(
        `Namespace "${namespace}" không tồn tại hoặc không mở cho renderer`,
      );
    }
    return found.store;
  }

  function watch({ namespace }) {
    if (!watching.has(namespace)) {
      const sub = exposed({ namespace }).onDidChange({
        listener: (event) => broadcast({ payload: { namespace, ...event } }),
      });
      watching.set(namespace, sub);
    }
    return true;
  }

  return {
    "storage:get": ({ namespace, key, fallback }) =>
      exposed({ namespace }).get({ key, fallback }),
    "storage:inspect": ({ namespace, key }) =>
      exposed({ namespace }).inspect({ key }),
    "storage:keys": ({ namespace, scope }) =>
      exposed({ namespace }).keys({ scope }),
    "storage:entries": ({ namespace, scope }) =>
      exposed({ namespace }).entries({ scope }),
    "storage:set": ({ namespace, key, value, scope }) => {
      exposed({ namespace }).set({ key, value, scope });
      return true;
    },
    "storage:delete": ({ namespace, key, scope }) => {
      exposed({ namespace }).delete({ key, scope });
      return true;
    },
    "storage:move": ({ namespace, key, from, to }) =>
      exposed({ namespace }).move({ key, from, to }),
    "storage:watch": watch,
  };
}

module.exports = { createHandlers };
