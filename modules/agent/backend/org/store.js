// store.js
const path = require("path");
const fs = require("fs");
const { readState } = require("../../../../src/main/state");
const { getPreset } = require("./presets/index");

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
    return initSolo();
  }
}

function initSolo() {
  const solo = getPreset("solo");
  return writeOrg({ presetId: solo.id, roles: solo.roles, instances: [] });
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
  setLastUsedPreset(preset.id);
  return writeOrg({
    presetId: preset.id,
    roles: preset.roles.map((r) => ({ ...r })),
    instances: [],
  });
}

function saveCurrentAsPreset(name) {
  const org = readOrg();
  if (!org) throw new Error("Chưa mở project.");
  const customStore = require("./presets/custom-store");
  const finalName =
    (name && name.trim()) || `Org tuỳ chỉnh ${customStore.list().length + 1}`;
  const roles = org.roles.map(
    ({ id, name, parentId, maxCount, canManage }) => ({
      id,
      name,
      parentId,
      maxCount,
      canManage,
    }),
  );
  const preset = customStore.save(finalName, roles);
  setLastUsedPreset(preset.id);
  return preset;
}
module.exports = {
  readOrg,
  writeOrg,
  selectPreset,
  saveCurrentAsPreset,
  getProjectPath,
};
