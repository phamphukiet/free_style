// setting-values.js
// Giá trị setting của ext lưu ở shared/storage (namespace "extension-values", key <extId>.<key>).
// Không đi qua engine của Settings nên không có nhóm nào hiện trong Settings.

const keyOf = ({ extId, id }) => id.slice(extId.length + 1);

/** @param {{ getService: Function, store: object }} deps */
function createSettingValues({ getService, store }) {
  return {
    read: ({ extId, definitions }) =>
      Object.fromEntries(
        definitions.map((def) => [
          keyOf({ extId, id: def.id }),
          store.get({ key: def.id, fallback: def.default }),
        ]),
      ),

    write: ({ id, value }) => {
      store.set({ key: id, value });
    },

    // Setting của chính module extension (extension.<key>); thiếu service → fallback.
    readOwn: ({ key, fallback }) =>
      getService({ id: "settings", needs: ["get"] })?.get({
        id: `extension.${key}`,
        fallback,
      }) ?? fallback,

    onChange: ({ listener }) =>
      store.onDidChange({ listener: ({ key }) => listener({ ids: [key] }) }),

    removeAll({ extId }) {
      store
        .keys()
        .filter((key) => key.startsWith(`${extId}.`))
        .forEach((key) => store.delete({ key }));
    },
  };
}

module.exports = { createSettingValues };
