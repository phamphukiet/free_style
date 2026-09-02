// preset-change.js
// Trách nhiệm duy nhất: tính diff role cũ/mới khi đổi preset, và áp dụng
// mapping do user chọn. KHÔNG tự suy luận "giữ tiến độ" — chỉ auto-arrange
// đơn giản theo tên trùng / thứ tự, còn lại để user tự quyết.

const { readOrg, writeOrg } = require("../store");
const { getPreset } = require("./index");

function instancesByRole(instances, roleId) {
  return instances.filter((i) => i.roleId === roleId);
}

function previewPresetChange(presetId) {
  const preset = getPreset(presetId);
  if (!preset) throw new Error(`Preset "${presetId}" không tồn tại.`);
  const current = readOrg();
  const oldRoles = current?.roles || [];
  const instances = current?.instances || [];
  const instancesByOldRole = {};
  oldRoles.forEach((r) => {
    const list = instancesByRole(instances, r.id);
    if (list.length > 0) instancesByOldRole[r.id] = list;
  });
  return { oldRoles, newRoles: preset.roles, instancesByOldRole };
}

function autoArrangeMapping(oldRoles, newRoles) {
  const mapping = {};
  oldRoles.forEach((oldRole, idx) => {
    const byName = newRoles.find((r) => r.name === oldRole.name);
    mapping[oldRole.id] = byName ? byName.id : newRoles[idx]?.id || null;
  });
  return mapping;
}

function applyPresetChange(presetId, mapping = {}) {
  const preset = getPreset(presetId);
  if (!preset) throw new Error(`Preset "${presetId}" không tồn tại.`);
  const current = readOrg();
  const oldInstances = current?.instances || [];
  const validNewIds = new Set(preset.roles.map((r) => r.id));

  const nextInstances = oldInstances
    .map((inst) => {
      const target = mapping[inst.roleId];
      if (target && validNewIds.has(target)) return { ...inst, roleId: target };
      return null; // không map -> bàn giao (gỡ khỏi org)
    })
    .filter(Boolean);
  setLastUsedPreset(preset.id);
  return writeOrg({
    presetId: preset.id,
    roles: preset.roles.map((r) => ({ ...r })),
    instances: nextInstances,
  });
}

module.exports = { previewPresetChange, autoArrangeMapping, applyPresetChange };
