// store.js
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { readState } = require("../../../../src/main/state");
const { getPreset } = require("./presets");

const ROOT_ROLE_ID = "manager";

function getProjectPath() {
  const { lastFolder } = readState();
  if (!lastFolder || !fs.existsSync(lastFolder)) return null;
  return lastFolder;
}
function orgFilePath(p) {
  return path.join(p, ".org", "org.json");
}

function readOrg() {
  const p = getProjectPath();
  if (!p) return null;
  try {
    return JSON.parse(fs.readFileSync(orgFilePath(p), "utf-8"));
  } catch {
    return null;
  }
}

function writeOrg(data) {
  const p = getProjectPath();
  if (!p) throw new Error("Chưa mở project.");
  const filePath = orgFilePath(p);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

function selectPreset(presetId) {
  const preset = getPreset(presetId);
  if (!preset) throw new Error(`Preset "${presetId}" không tồn tại.`);
  return writeOrg({
    presetId: preset.id,
    roles: preset.roles.map((r) => ({ ...r })),
    instances: [],
  });
}

function addRole(name, parentId) {
  const org = readOrg();
  if (!org) throw new Error("Chưa chọn mô hình tổ chức.");
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
  readOrg,
  writeOrg,
  selectPreset,
  addRole,
  renameRole,
  removeRole,
  updateRoleParent,
  getProjectPath,
  ROOT_ROLE_ID,
};
