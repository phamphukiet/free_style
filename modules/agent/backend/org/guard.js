// guard.js — luôn xét theo org đang ACTIVE thật (có fallback), không dùng "org cuối" mập mờ.
const { getOrg, resolveActiveOrgId } = require("./store");

function canManageRole(actorRoleId, targetRoleId) {
  const org = getOrg(resolveActiveOrgId());
  if (!org) return false;
  if (actorRoleId === targetRoleId) return true;
  const actor = org.roles.find((r) => r.id === actorRoleId);
  return !!actor && (actor.canManage || []).includes(targetRoleId);
}

function checkMaxCount(targetRoleId) {
  const org = getOrg(resolveActiveOrgId());
  if (!org) return true;
  const role = org.roles.find((r) => r.id === targetRoleId);
  if (!role || role.maxCount == null) return true;
  const count = (org.instances || []).filter(
    (i) => i.roleId === targetRoleId,
  ).length;
  return count < role.maxCount;
}

module.exports = { canManageRole, checkMaxCount };
