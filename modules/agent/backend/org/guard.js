// guard.js — chỉ được gọi khi agent:save có ctx.actorRoleId, org không tự khoá nếu không có ctx.
const { readOrg } = require("./store");

function canManageRole(actorRoleId, targetRoleId) {
  const org = readOrg();
  if (!org) return false;
  if (actorRoleId === targetRoleId) return true;
  const actor = org.roles.find((r) => r.id === actorRoleId);
  return !!actor && (actor.canManage || []).includes(targetRoleId);
}

function checkMaxCount(targetRoleId) {
  const org = readOrg();
  if (!org) return true;
  const role = org.roles.find((r) => r.id === targetRoleId);
  if (!role || role.maxCount == null) return true;
  const count = (org.instances || []).filter(
    (i) => i.roleId === targetRoleId,
  ).length;
  return count < role.maxCount;
}

module.exports = { canManageRole, checkMaxCount };
