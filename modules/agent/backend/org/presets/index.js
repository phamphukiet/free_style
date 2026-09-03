// index.js
// Preset built-in giờ chỉ là TEMPLATE để tạo org mới, không còn nơi lưu trạng thái.

const { PRESETS, ROOT_ROLE_ID } = require("./data");

function listPresets() {
  return PRESETS.filter((p) => !p.hidden).map(({ id, name }) => ({ id, name }));
}

function getPreset(id) {
  const preset = PRESETS.find((p) => p.id === id);
  if (!preset) return null;
  return {
    id: preset.id,
    name: preset.name,
    hidden: !!preset.hidden,
    roles: preset.roles.map((r) => ({ ...r })),
  };
}

module.exports = { listPresets, getPreset, ROOT_ROLE_ID };
