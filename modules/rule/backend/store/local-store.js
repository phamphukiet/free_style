// local-store.js
// Rule LOCAL: <project>/.vibe/rules/<id>.md (nội dung) + manifest.json
// (metadata: name, enabled, agentIds). Chỉ áp dụng trong project đang mở.
// Không biết global / chat / UI là gì.

const path = require("path");
const fs = require("fs");
const { readState } = require("../../../../src/main/state");

const defined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

const rulesDir = (project) => path.join(project, ".vibe", "rules");
const manifestPath = (project) => path.join(rulesDir(project), "manifest.json");
const safeFileName = (id) => id.replace(/[:*?"<>|/\\]/g, "_") + ".md";

function getProjectPath() {
  const { lastFolder } = readState();
  return lastFolder && fs.existsSync(lastFolder) ? lastFolder : null;
}

function readManifest(project) {
  try {
    return JSON.parse(fs.readFileSync(manifestPath(project), "utf-8"));
  } catch {
    return {};
  }
}

function writeManifest(project, data) {
  fs.mkdirSync(rulesDir(project), { recursive: true });
  fs.writeFileSync(
    manifestPath(project),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}

// Nội dung luôn đọc từ file .md → người dùng sửa tay là chat thấy ngay.
function readContent(project, entry) {
  try {
    return fs.readFileSync(
      path.join(rulesDir(project), entry.fileName),
      "utf-8",
    );
  } catch {
    return "";
  }
}

function toRule(project, id, entry) {
  return {
    id,
    name: entry.name || id,
    enabled: entry.enabled !== false,
    agentIds: entry.agentIds || [],
    content: readContent(project, entry),
  };
}

function list() {
  const project = getProjectPath();
  if (!project) return [];
  return Object.entries(readManifest(project)).map(([id, e]) =>
    toRule(project, id, e),
  );
}

function get(id) {
  const project = getProjectPath();
  const entry = project && readManifest(project)[id];
  return entry ? toRule(project, id, entry) : null;
}

// rule: { id, name?, content?, enabled?, agentIds? } — chỉ ghi phần được truyền.
function upsert(rule) {
  const project = getProjectPath();
  if (!project) throw new Error("Chưa mở project nào.");
  const manifest = readManifest(project);
  const prev = manifest[rule.id];
  const entry = {
    ...{
      name: "Rule mới",
      enabled: true,
      agentIds: [],
      installedAt: Date.now(),
    },
    ...prev,
    ...defined({
      name: rule.name,
      enabled: rule.enabled,
      agentIds: rule.agentIds,
    }),
    fileName: safeFileName(rule.id),
  };
  if (rule.content !== undefined || !prev) {
    fs.mkdirSync(rulesDir(project), { recursive: true });
    fs.writeFileSync(
      path.join(rulesDir(project), entry.fileName),
      rule.content ?? "",
      "utf-8",
    );
  }
  manifest[rule.id] = entry;
  writeManifest(project, manifest);
  return toRule(project, rule.id, entry);
}

function remove(id) {
  const project = getProjectPath();
  const manifest = project && readManifest(project);
  const entry = manifest && manifest[id];
  if (!entry) return false;
  fs.rmSync(path.join(rulesDir(project), entry.fileName), { force: true });
  delete manifest[id];
  writeManifest(project, manifest);
  return true;
}

module.exports = { getProjectPath, list, get, upsert, remove };
