// presets.js
// Trách nhiệm duy nhất: định nghĩa sẵn danh sách preset mô hình tổ chức (org).
// store.js dùng getPreset(id) khi selectPreset(); ipc.js dùng listPresets()
// để hiển thị lựa chọn khi project chưa có org.json.

const ROOT_ROLE_ID = "manager";

const PRESETS = [
  {
    id: "solo",
    name: "Một mình (Solo)",
    roles: [
      {
        id: ROOT_ROLE_ID,
        name: "Manager",
        parentId: null,
        maxCount: 1,
        canManage: [],
      },
    ],
  },
  {
    id: "sprint",
    name: "Sprint (Scrum tuyến tính)",
    roles: [
      {
        id: "manager",
        name: "Manager",
        parentId: null,
        maxCount: 1,
        canManage: ["lead"],
      },
      {
        id: "lead",
        name: "Sprint Lead",
        parentId: "manager",
        maxCount: 1,
        canManage: ["dev", "qa"],
      },
      {
        id: "dev",
        name: "Developer",
        parentId: "lead",
        maxCount: 1,
        canManage: [],
      },
      { id: "qa", name: "QA", parentId: "lead", maxCount: null, canManage: [] },
    ],
  },
  {
    id: "dawin",
    name: "Dawin (Cạnh tranh chọn lọc)",
    roles: [
      {
        id: "manager",
        name: "Manager",
        parentId: null,
        maxCount: 1,
        canManage: ["candidate", "reviewer"],
      },
      {
        id: "candidate",
        name: "Candidate",
        parentId: "manager",
        maxCount: null,
        canManage: [],
      },
      {
        id: "reviewer",
        name: "Reviewer",
        parentId: "manager",
        maxCount: 1,
        canManage: [],
      },
    ],
  },
];

function listPresets() {
  return PRESETS.map(({ id, name }) => ({ id, name }));
}

function getPreset(id) {
  const preset = PRESETS.find((p) => p.id === id);
  if (!preset) return null;
  return {
    id: preset.id,
    name: preset.name,
    roles: preset.roles.map((r) => ({ ...r })),
  };
}

module.exports = { listPresets, getPreset, ROOT_ROLE_ID };
