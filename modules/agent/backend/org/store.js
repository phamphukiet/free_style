// store.js
const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const { getPreset } = require("./presets/index");

const ORG_FILE = path.join(app.getPath("userData"), "org.json");

function readOrg() {
  try {
    return JSON.parse(fs.readFileSync(ORG_FILE, "utf-8"));
  } catch {
    return null; // chưa chọn preset nào — UI tự hiện danh sách mặc định (data.js)
  }
}

function writeOrg(data) {
  fs.writeFileSync(ORG_FILE, JSON.stringify(data, null, 2), "utf-8");
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
};
