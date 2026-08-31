// store.js
// CRUD org.json: <project>/.org/org.json. Copy từ preset lúc chọn, sau đó sửa tự do,
// không ảnh hưởng preset gốc.

const path = require("path");
const fs = require("fs");
const { readState } = require("../../../../src/main/state");
const { getPreset } = require("./presets");

function getProjectPath() {
  const { lastFolder } = readState();
  if (!lastFolder || !fs.existsSync(lastFolder)) return null;
  return lastFolder;
}

function orgFilePath(projectPath) {
  return path.join(projectPath, ".org", "org.json");
}

function readOrg() {
  const projectPath = getProjectPath();
  if (!projectPath) return null;
  try {
    return JSON.parse(fs.readFileSync(orgFilePath(projectPath), "utf-8"));
  } catch {
    return null;
  }
}

function writeOrg(data) {
  const projectPath = getProjectPath();
  if (!projectPath) throw new Error("Chưa mở project.");
  const filePath = orgFilePath(projectPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

function selectPreset(presetId) {
  const preset = getPreset(presetId);
  if (!preset) throw new Error(`Preset "${presetId}" không tồn tại.`);
  const data = {
    presetId: preset.id,
    roles: preset.roles.map((r) => ({ ...r })),
    instances: [], // { id, roleId, agentId } — gán agent thật sau
  };
  return writeOrg(data);
}

module.exports = { readOrg, writeOrg, selectPreset, getProjectPath };
