// roles.js
// Trách nhiệm duy nhất: CRUD vai trò trong org hiện tại. Tách khỏi store.js
// vì store.js đã chạm giới hạn 100 dòng. Vai trò gốc "manager" và org preset
// "solo" (mặc định ẩn) không thể sửa/xoá/thêm.

const crypto = require("crypto");
const { readOrg, writeOrg } = require("./store");

const ROOT_ROLE_ID = "manager";

function assertNotSolo(org) {
  if (org.presetId === "solo")
    throw new Error("Không thể sửa tổ chức Solo mặc định.");
}

function addRole(name, parentId) {
  const org = readOrg();
  if (!org) throw new Error("Chưa chọn mô hình tổ chức.");
  assertNotSolo(org);
  org.roles.push({
    id: crypto.randomUUID(),
    name: name || "Vai trò mới",
    parentId: parentId === undefined ? ROOT_ROLE_ID : parentId,
    maxCount: null,
    canManage: [],
  });
  return writeOrg(org);
}

function renameRole(id, name) {
  if (id === ROOT_ROLE_ID)
    throw new Error("Không thể đổi tên vai trò Manager.");
  const org = readOrg();
  if (!org) throw new Error("Chưa chọn mô hình tổ chức.");
  const role = org.roles.find((r) => r.id === id);
  if (!role) throw new Error("Vai trò không tồn tại.");
  role.name = name;
  return writeOrg(org);
}

function removeRole(id) {
  if (id === ROOT_ROLE_ID) throw new Error("Không thể xoá vai trò Manager.");
  const org = readOrg();
  if (!org) return null;
  org.roles = org.roles.filter((r) => r.id !== id); // chỉ xoá role này, không cascade
  return writeOrg(org);
}

function updateRoleParent(id, parentId) {
  if (id === ROOT_ROLE_ID) throw new Error("Không thể chuyển vai trò Manager.");
  const org = readOrg();
  if (!org) throw new Error("Chưa chọn mô hình tổ chức.");
  const role = org.roles.find((r) => r.id === id);
  if (!role) throw new Error("Vai trò không tồn tại.");
  role.parentId = parentId === undefined ? ROOT_ROLE_ID : parentId;
  return writeOrg(org);
}

module.exports = {
  addRole,
  renameRole,
  removeRole,
  updateRoleParent,
  ROOT_ROLE_ID,
};
