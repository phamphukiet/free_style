// install.js
// "Cài" workflow vào project = ghi snapshot ra <project>/.vibe/workflow/<id>.json
// + manifest.json — giống pattern install.js của rule/skill.

const path = require("path");
const fs = require("fs");
const { readState } = require("../../../../src/main/state");

function getProjectPath() {
  const { lastFolder } = readState();
  if (!lastFolder || !fs.existsSync(lastFolder)) return null;
  return lastFolder;
}

function workflowDir(projectPath) {
  return path.join(projectPath, ".vibe", "workflow");
}

function manifestPath(projectPath) {
  return path.join(workflowDir(projectPath), "manifest.json");
}

function readManifest(projectPath) {
  try {
    return JSON.parse(fs.readFileSync(manifestPath(projectPath), "utf-8"));
  } catch {
    return {};
  }
}

function writeManifest(projectPath, data) {
  fs.mkdirSync(workflowDir(projectPath), { recursive: true });
  fs.writeFileSync(
    manifestPath(projectPath),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}

function safeFileName(id) {
  return id.replace(/[:*?"<>|/\\]/g, "_") + ".json";
}

function installWorkflow(workflow) {
  const projectPath = getProjectPath();
  if (!projectPath) throw new Error("Chưa mở project nào để cài workflow vào.");

  const fileName = safeFileName(workflow.id);
  fs.mkdirSync(workflowDir(projectPath), { recursive: true });
  fs.writeFileSync(
    path.join(workflowDir(projectPath), fileName),
    JSON.stringify(workflow, null, 2),
    "utf-8",
  );

  const manifest = readManifest(projectPath);
  manifest[workflow.id] = { fileName, installedAt: Date.now() };
  writeManifest(projectPath, manifest);
  return { installed: true };
}

function uninstallWorkflow(id) {
  const projectPath = getProjectPath();
  if (!projectPath) return false;
  const manifest = readManifest(projectPath);
  const entry = manifest[id];
  if (entry) {
    const filePath = path.join(workflowDir(projectPath), entry.fileName);
    if (fs.existsSync(filePath)) fs.rmSync(filePath, { force: true });
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

module.exports = {
  installWorkflow,
  uninstallWorkflow,
  listInstalled,
  getProjectPath,
};
