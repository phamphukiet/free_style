// entity.js: cho chat tìm extension theo tên người dùng gõ.
const {
  registerCapability,
} = require("../../../shared/core/capability-registry.js");
const { rank } = require("../../../shared/command/rank.js");

const toItem = (ext) => ({
  key: ext.id,
  label: ext.name,
  names: [ext.id, ext.name],
});

/** @param {{ list: () => object[] }} args */
function registerExtensionEntity({ list }) {
  registerCapability({
    id: "extension",
    kind: "entity",
    find: ({ text }) => rank({ items: list().map(toItem), text }),
  });
}

module.exports = { registerExtensionEntity };
