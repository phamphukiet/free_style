// store.js
const ordsStore = require("./orgs-store");
const { listPresets, getPreset, ROOT_ROLE_ID } = require("./presets/index");
const { getActiveOrgId } = require("./last-used");

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

function resolveActiveOrgId() {
  return getActiveOrgId() || ordsStore.list()[0]?.id || null;
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
  return ordsStore.remove(id);
}

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
