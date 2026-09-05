const { ipcMain } = require("electron");
const { listPresets } = require("./presets/index");
const {
  listOrgs,
  getOrg,
  createOrgFromPreset,
  renameOrg,
  deleteOrg,
  saveOrgAsNew,
} = require("./store");
const { previewActivate, confirmActivate } = require("./activate");
const { getActiveOrgId } = require("./last-used");
const {
  addRole,
  renameRole,
  removeRole,
  updateRoleParent,
  updateRoleMaxCount,
} = require("./roles");
const {
  addInstance,
  removeInstance,
  listInstancesByRole,
} = require("./instances");

function registerOrgIpc() {
  ipcMain.handle("org:list-presets", () => listPresets());
  ipcMain.handle("org:list", () => listOrgs());
  ipcMain.handle("org:get", (e, id) => getOrg(id));
  ipcMain.handle("org:get-active-id", () => getActiveOrgId());
  ipcMain.handle("org:create", (e, presetId, name) =>
    createOrgFromPreset(presetId, name),
  );
  ipcMain.handle("org:rename", (e, id, name) => renameOrg(id, name));
  ipcMain.handle("org:delete", (e, id) => deleteOrg(id));
  ipcMain.handle("org:preview-activate", (e, id) => previewActivate(id));
  ipcMain.handle("org:confirm-activate", (e, id) => confirmActivate(id));
  ipcMain.handle("org:save-as-new", (e, orgId, name) =>
    saveOrgAsNew(orgId, name),
  );

  ipcMain.handle("org:add-role", (e, orgId, name, parentId) =>
    addRole(orgId, name, parentId),
  );
  ipcMain.handle("org:rename-role", (e, orgId, id, name) =>
    renameRole(orgId, id, name),
  );
  ipcMain.handle("org:remove-role", (e, orgId, id) => removeRole(orgId, id));
  ipcMain.handle("org:update-role-parent", (e, orgId, id, parentId) =>
    updateRoleParent(orgId, id, parentId),
  );
  ipcMain.handle("org:update-role-maxcount", (e, orgId, id, maxCount) =>
    updateRoleMaxCount(orgId, id, maxCount),
  );

  ipcMain.handle("org:add-instance", (e, orgId, roleId, agentId) =>
    addInstance(orgId, roleId, agentId),
  );
  ipcMain.handle("org:remove-instance", (e, orgId, id) =>
    removeInstance(orgId, id),
  );
  ipcMain.handle("org:list-instances", (e, orgId, roleId) =>
    listInstancesByRole(orgId, roleId),
  );
}

module.exports = { registerOrgIpc };
