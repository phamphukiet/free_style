// roles.js
// CRUD vai trò trong 1 org cụ thể (theo orgId). Vai trò gốc "manager" không sửa/xoá.

const crypto = require("crypto");
const { getOrg, writeOrgData } = require("./store");

const ROOT_ROLE_ID = "manager";

function addRole(orgId, name, parentId) {
  const org = getOrg(orgId);
  if (!org) throw new Error("Org không tồn tại.");
  org.roles.push({
    id: crypto.randomUUID(),
    name: name || "Vai trò mới",
    parentId: parentId === undefined ? ROOT_ROLE_ID : parentId,
    maxCount: null,
    canManage: [],
  });
  return writeOrgData(org);
}

function renameRole(orgId, id, name) {
  if (id === ROOT_ROLE_ID)
    throw new Error("Không thể đổi tên vai trò Manager.");
  const org = getOrg(orgId);
  if (!org) throw new Error("Org không tồn tại.");
  const role = org.roles.find((r) => r.id === id);
  if (!role) throw new Error("Vai trò không tồn tại.");
  role.name = name;
  return writeOrgData(org);
}

function removeRole(orgId, id) {
  if (id === ROOT_ROLE_ID) throw new Error("Không thể xoá vai trò Manager.");
  const org = getOrg(orgId);
  if (!org) return null;
  org.roles = org.roles.filter((r) => r.id !== id);
  org.instances = org.instances.filter((i) => i.roleId !== id);
  return writeOrgData(org);
}

function updateRoleParent(orgId, id, parentId) {
  if (id === ROOT_ROLE_ID) throw new Error("Không thể chuyển vai trò Manager.");
  const org = getOrg(orgId);
  if (!org) throw new Error("Org không tồn tại.");
  const role = org.roles.find((r) => r.id === id);
  if (!role) throw new Error("Vai trò không tồn tại.");
  role.parentId = parentId === undefined ? ROOT_ROLE_ID : parentId;
  return writeOrgData(org);
}

function updateRoleMaxCount(orgId, id, maxCount) {
  const org = getOrg(orgId);
  if (!org) throw new Error("Org không tồn tại.");
  const role = org.roles.find((r) => r.id === id);
  if (!role) throw new Error("Vai trò không tồn tại.");
  role.maxCount = maxCount;
  return writeOrgData(org);
}

module.exports = {
  addRole,
  renameRole,
  removeRole,
  updateRoleParent,
  updateRoleMaxCount,
  ROOT_ROLE_ID,
};
