// modules/settings/backend/setting/entity.js
// entity "setting": cho chat tìm setting theo tên người dùng gõ.
// rank thẳng không ra thì shared/command/list.js nhờ simplify rút từ khóa.

const {
  registerCapability,
} = require("../../../../shared/core/capability-registry.js");
const { findKeys } = require("../../../../shared/command/list.js");

function registerSettingEntity({ getItems }) {
  registerCapability({
    id: "setting",
    kind: "entity",
    find: ({ text }) => findKeys({ items: getItems(), text }),
  });
}

module.exports = { registerSettingEntity };
