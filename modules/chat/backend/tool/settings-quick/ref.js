// ref.js — tham chiếu tool "settings" qua registry, không require chéo module.

const {
  getCapability,
} = require("../../../../../shared/core/capability-registry.js");

const settingsTool = () => getCapability({ kind: "tool", id: "settings" });
const optionKind = (id) => `setting-option:${id}`;

module.exports = { settingsTool, optionKind };
