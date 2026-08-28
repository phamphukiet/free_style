// install.js
// "Thêm" rule vào project = ghi snapshot content ra <project>/.rules/<id>.md
// + manifest.json ngay trong project — trạng thái "có trong project" gắn với
// project cụ thể, giống pattern install.js của skill.

const path = require("path");
const fs = require("fs");
const { readState } = require("../../../../src/main/state");

function getProjectPath() {
  const { lastFolder } = readState();
  if (!lastFolder || !fs.existsSync(lastFolder)) return null;
  return lastFolder;
}

function rulesDir(projectPath) {
  return path.join(projectPath, ".rules");
}

function manifestPath(projectPath) {
  return path.join(rulesDir(projectPath), "manifest.json");
}

function readManifest(projectPath) {
  try {
    return JSON.parse(fs.readFileSync(manifestPath(projectPath), "utf-8"));
  } catch {
    return {};
  }
}

function writeManifest(projectPath, data) {
  fs.mkdirSync(rulesDir(projectPath), { recursive: true });
  fs.writeFileSync(
    manifestPath(projectPath),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}

function safeFileName(id) {
  return id.replace(/[:*?"<>|/\\]/g, "_") + ".md";
}

function installRule(rule) {
  const projectPath = getProjectPath();
  if (!projectPath) throw new Error("Chưa mở project nào để thêm rule vào.");

  const fileName = safeFileName(rule.id);
  fs.mkdirSync(rulesDir(projectPath), { recursive: true });
  fs.writeFileSync(
    path.join(rulesDir(projectPath), fileName),
    rule.content || "",
    "utf-8",
  );

  const manifest = readManifest(projectPath);
  manifest[rule.id] = { fileName, installedAt: Date.now() };
  writeManifest(projectPath, manifest);
  return { installed: true };
}

function uninstallRule(id) {
  const projectPath = getProjectPath();
  if (!projectPath) return false;
  const manifest = readManifest(projectPath);
  const entry = manifest[id];
  if (entry) {
    const filePath = path.join(rulesDir(projectPath), entry.fileName);
    if (fs.existsSync(filePath)) fs.rmSync(filePath, { force: true });
  }
  if (entry) {
    delete manifest[id];
    writeManifest(projectPath, manifest);
  }
  return true;
}

function listInstalled() {
  const projectPath = getProjectPath();
  if (!projectPath) return {};
  return readManifest(projectPath);
}

module.exports = { installRule, uninstallRule, listInstalled, getProjectPath };
