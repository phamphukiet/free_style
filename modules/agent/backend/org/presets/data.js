// data.js
// Dữ liệu preset thô — tách khỏi index.js để logic không phình theo số preset.

const ROOT_ROLE_ID = "manager";

const PRESETS = [
  {
    id: "solo",
    name: "Một mình (Solo)",
    hidden: true, // luôn tồn tại ngầm khi org chưa được chọn; không cho chọn tay
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
  {
    id: "kanban",
    name: "Kanban (Luồng liên tục)",
    roles: [
      {
        id: "manager",
        name: "Manager",
        parentId: null,
        maxCount: 1,
        canManage: ["worker"],
      },
      {
        id: "worker",
        name: "Worker",
        parentId: "manager",
        maxCount: null,
        canManage: [],
      },
    ],
  },
  {
    id: "pod",
    name: "Pod (Đội nhỏ đa năng)",
    roles: [
      {
        id: "manager",
        name: "Manager",
        parentId: null,
        maxCount: 1,
        canManage: ["member"],
      },
      {
        id: "member",
        name: "Member",
        parentId: "manager",
        maxCount: 4,
        canManage: [],
      },
    ],
  },
];

module.exports = { PRESETS, ROOT_ROLE_ID };
