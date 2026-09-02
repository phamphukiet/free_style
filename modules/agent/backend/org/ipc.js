const { ipcMain } = require("electron");
const { listPresets } = require("./presets/index");
const { readOrg, selectPreset, writeOrg } = require("./store");
const { addRole, renameRole, removeRole, updateRoleParent } = require("./roles");
const {
  addInstance,
  removeInstance,
  listInstancesByRole,
} = require("./instances");
const { getLastUsedPreset } = require("./last-used");
const {
  previewPresetChange,
  autoArrangeMapping,
  applyPresetChange,
} = require("./presets/preset-change");

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

  ipcMain.handle("org:preview-preset-change", (e, presetId, mapping) =>
    previewPresetChange(presetId, mapping),
  );
  ipcMain.handle("org:auto-arrange-mapping", (e, presetId) =>
    autoArrangeMapping(presetId),
  );
  ipcMain.handle("org:apply-preset-change", (e, presetId, mapping) =>
    applyPresetChange(presetId, mapping),
  );
  ipcMain.handle("org:save-as-preset", (e, name) =>
    require("./store").saveCurrentAsPreset(name),
  );
  ipcMain.handle("org:get-last-used-preset", () => getLastUsedPreset());
}

module.exports = { registerOrgIpc };
