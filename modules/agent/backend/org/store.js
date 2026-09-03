// Sau
const ordsStore = require("./orgs-store");
const { listPresets, getPreset, ROOT_ROLE_ID } = require("./presets/index");
const { getActiveOrgId } = require("./last-used");

// userData dùng chung mọi project (giống theme). Chỉ seed 1 LẦN DUY NHẤT khi
// chưa có org nào — tạo sẵn các preset công khai (sprint/dawin/kanban/pod)
// làm org thật trong userData, không tự active org nào.
function ensurePresetsSeeded() {
  if (ordsStore.list().length > 0) return;
  listPresets().forEach(({ id }) => {
    const preset = getPreset(id);
    ordsStore.save({ name: preset.name, roles: preset.roles, instances: [] });
  });
}

function listOrgs() {
  ensurePresetsSeeded();
  return ordsStore.list().map(({ id, name }) => ({ id, name }));
}

function getOrg(id) {
  ensurePresetsSeeded();
  return id ? ordsStore.get(id) : null;
}

// Không có org active là trạng thái hợp lệ. Chỉ fallback về org đầu tiên
// (nếu có) để guard.js vẫn check được quyền — không set lại state, không
// tự kích hoạt gì cả.
function resolveActiveOrgId() {
  return getActiveOrgId() || ordsStore.list()[0]?.id || null;
}

// Org đang hoạt động thật sự dùng để check quyền (guard) — có fallback nếu chưa từng activate.
function resolveActiveOrgId() {
  ensureDefaultOrg();
  return (
    getActiveOrgId() ||
    ordsStore.list().find((o) => !o.hidden)?.id ||
    ordsStore.list()[0]?.id
  );
}

function createOrgFromPreset(presetId, name) {
  const preset = getPreset(presetId) || {
    name: "Org mới",
    roles: [
      {
        id: ROOT_ROLE_ID,
        name: "Manager",
        parentId: null,
        maxCount: 1,
        canManage: [],
      },
    ],
  };
  return ordsStore.save({
    name: name?.trim() || preset.name,
    roles: preset.roles.map((r) => ({ ...r })),
    instances: [],
  });
}

function renameOrg(id, name) {
  const org = ordsStore.get(id);
  if (!org) throw new Error("Org không tồn tại.");
  org.name = name;
  return ordsStore.save(org);
}

function deleteOrg(id) {
  if (getActiveOrgId() === id) setActiveOrgId(null);
  return ordsStore.remove(id);
}

// Lưu snapshot của org được TRUYỀN VÀO (orgId) — không phải org đang active toàn cục,
// để đúng ý "lưu theo cái tôi đang mở trong editor", tránh lệch với org cuối cùng activate.
function saveOrgAsNew(orgId, name) {
  const source = ordsStore.get(orgId);
  if (!source) throw new Error("Org không tồn tại.");
  const roles = source.roles.map(
    ({ id, name, parentId, maxCount, canManage }) => ({
      id,
      name,
      parentId,
      maxCount,
      canManage,
    }),
  );
  const instances = source.instances.map(({ id, roleId, agentId }) => ({
    id,
    roleId,
    agentId,
  }));
  return ordsStore.save({
    name: name?.trim() || `${source.name} (copy)`,
    roles,
    instances,
  });
}

module.exports = {
  listOrgs,
  getOrg,
  resolveActiveOrgId,
  createOrgFromPreset,
  renameOrg,
  deleteOrg,
  saveOrgAsNew,
  writeOrgData: ordsStore.save,
};
