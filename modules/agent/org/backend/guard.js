// guard.js
// Không có org.json -> fail-open, không giới hạn gì (đảm bảo xoá org/ vẫn chạy bình thường).
// actorRoleId rỗng (user thao tác tay qua UI) -> luôn cho phép.

const { readOrg } = require("./store");

function canManageRole(actorRoleId, targetRoleId) {
  const org = readOrg();
  if (!org || !actorRoleId) return true;
  const actorRole = org.roles.find((r) => r.id === actorRoleId);
  if (!actorRole) return true; // role lạ -> fail-open, tránh khoá app
  return (actorRole.canManage || []).includes(targetRoleId);
}

function checkMaxCount(targetRoleId) {
  const org = readOrg();
  if (!org) return true;
  const role = org.roles.find((r) => r.id === targetRoleId);
  if (!role || !role.maxCount) return true;
  const current = org.instances.filter((i) => i.roleId === targetRoleId).length;
  return current < role.maxCount;
}

module.exports = { canManageRole, checkMaxCount };
