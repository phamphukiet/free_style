// presets.js
// Preset mô hình tổ chức mặc định — hardcode trong code, chỉ đọc/copy, không sửa trực tiếp.

const SPRINT_PRESET = {
  id: "sprint",
  name: "Sprint Team",
  roles: [
    {
      id: "manager",
      name: "Manager",
      parentId: null,
      maxCount: 1,
      canManage: ["dev", "qa"],
    },
    {
      id: "dev",
      name: "Developer",
      parentId: "manager",
      maxCount: 5,
      canManage: [],
    },
    { id: "qa", name: "QA", parentId: "manager", maxCount: 2, canManage: [] },
  ],
};

const PRESETS = { sprint: SPRINT_PRESET };

function listPresets() {
  return Object.values(PRESETS).map((p) => ({ id: p.id, name: p.name }));
}

function getPreset(id) {
  return PRESETS[id] || null;
}

module.exports = { listPresets, getPreset };
