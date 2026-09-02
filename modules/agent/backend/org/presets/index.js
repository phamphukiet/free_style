// index.js
// listPresets(): danh sách cho UI chọn — ẩn preset có hidden:true (solo).
// getPreset(id): dùng nội bộ (store.js cần lấy được cả "solo" để auto-init).

const { PRESETS, ROOT_ROLE_ID } = require("./data");
const customStore = require("./custom-store");

function listPresets() {
  return [
    ...PRESETS.filter((p) => !p.hidden).map(({ id, name }) => ({ id, name })),
    ...customStore.list().map(({ id, name }) => ({ id, name })),
  ];
}

function getPreset(id) {
  const preset = PRESETS.find((p) => p.id === id);
  if (preset)
    return {
      id: preset.id,
      name: preset.name,
      hidden: !!preset.hidden,
      roles: preset.roles.map((r) => ({ ...r })),
    };
  const custom = customStore.get(id);
  return custom
    ? {
        id: custom.id,
        name: custom.name,
        hidden: false,
        roles: custom.roles.map((r) => ({ ...r })),
      }
    : null;
}

module.exports = { listPresets, getPreset, ROOT_ROLE_ID };
