const { ipcMain } = require("electron");
const { listPresets } = require("./presets");
const {
  readOrg,
  selectPreset,
  writeOrg,
  addRole,
  renameRole,
  removeRole,
  updateRoleParent,
} = require("./store");
const {
  addInstance,
  removeInstance,
  listInstancesByRole,
} = require("./instances");

function registerOrgIpc() {
  ipcMain.handle("org:list-presets", () => listPresets());
  ipcMain.handle("org:get", () => readOrg());
  ipcMain.handle("org:select-preset", (e, presetId) => selectPreset(presetId));
  ipcMain.handle("org:update", (e, data) => writeOrg(data));

  ipcMain.handle("org:add-role", (e, name, parentId) =>
    addRole(name, parentId),
  );
  ipcMain.handle("org:rename-role", (e, id, name) => renameRole(id, name));
  ipcMain.handle("org:remove-role", (e, id) => removeRole(id));
  ipcMain.handle("org:update-role-parent", (e, id, parentId) =>
    updateRoleParent(id, parentId),
  );

  ipcMain.handle("org:add-instance", (e, roleId, agentId) =>
    addInstance(roleId, agentId),
  );
  ipcMain.handle("org:remove-instance", (e, id) => removeInstance(id));
  ipcMain.handle("org:list-instances", (e, roleId) =>
    listInstancesByRole(roleId),
  );
}

module.exports = { registerOrgIpc };
