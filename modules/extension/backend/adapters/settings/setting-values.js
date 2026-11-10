// setting-values.js
// Đọc giá trị hiệu lực, theo dõi thay đổi, xóa giá trị của ext. Phần read/onChange/removeAll của port.
// Service "settings" chưa có (module settings tắt/chưa load) → dùng default, không ném lỗi.

const keyOf = ({ extId, id }) => id.slice(extId.length + 1);
const NOOP = { dispose() {} };

/** @param {{ getService: Function, openStore: () => object }} deps */
function createSettingValues({ getService, openStore }) {
  const service = () =>
    getService({ id: "settings", needs: ["get", "onDidChange"] });

  return {
    read({ extId, definitions }) {
      const api = service();
      return Object.fromEntries(
        definitions.map((def) => [
          keyOf({ extId, id: def.id }),
          api ? api.get({ id: def.id, fallback: def.default }) : def.default,
        ]),
      );
    },

    onChange: ({ listener }) => service()?.onDidChange({ listener }) ?? NOOP,

    removeAll({ extId }) {
      const store = openStore();
      store
        .keys()
        .filter((key) => key.startsWith(`${extId}.`))
        .forEach((key) => store.delete({ key }));
    },
  };
}

module.exports = { createSettingValues };
