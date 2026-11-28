// modules/extension/backend/entity.js
// entity.js: cho chat tìm extension theo tên người dùng gõ.
// rank thẳng không ra (VD "auto save" vs id "auto-save") thì nhờ simplify rút từ khóa.
const {
  registerCapability,
} = require("../../../shared/core/capability-registry.js");
const { findKeys } = require("../../../shared/command/list.js");

const toItem = (ext) => ({
  key: ext.id,
  label: ext.name,
  names: [ext.id, ext.name],
});

function registerExtensionEntity({ list }) {
  registerCapability({
    id: "extension",
    kind: "entity",
    find: ({ text }) => findKeys({ items: list().map(toItem), text }),
  });
}

module.exports = { registerExtensionEntity };
