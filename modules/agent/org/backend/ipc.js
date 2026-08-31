const { ipcMain } = require("electron");
const { listPresets } = require("./presets");
const { readOrg, selectPreset, writeOrg } = require("./store");
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
  ipcMain.handle("org:instances:add", (e, roleId, agentId) => addInstance(roleId, agentId));
  ipcMain.handle("org:instances:remove", (e, instanceId) => removeInstance(instanceId));
  ipcMain.handle("org:instances:list-by-role", (e, roleId) => listInstancesByRole(roleId));
}

module.exports = { registerOrgIpc };
