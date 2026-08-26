// install.js
// Cài skill TRỰC TIẾP vào project đang mở: <project>/.skills/<skillId>/.
// Manifest cài đặt lưu NGAY TRONG project (.skills/manifest.json) — không
// lưu ở userData, vì trạng thái "đã cài" gắn với project cụ thể, không phải
// gắn với máy. Có installOptions → answers được thay vào nội dung qua {{key}}.

const path = require("path");
const fs = require("fs");
const { readState } = require("../../../../src/main/state");

function getProjectPath() {
  const { lastFolder } = readState();
  if (!lastFolder || !fs.existsSync(lastFolder)) return null;
  return lastFolder;
}

// Windows cấm ':' (và vài ký tự khác) trong tên file/folder — id kiểu
// "npm:@scope/name" (npm.js) phải được làm sạch trước khi dùng làm tên thư mục.
function safeDirName(id) {
  return id.replace(/[:*?"<>|]/g, "_");
}

function skillsDir(projectPath) {
  return path.join(projectPath, ".skills");
}

function manifestPath(projectPath) {
  return path.join(skillsDir(projectPath), "manifest.json");
}

function readManifest(projectPath) {
  try {
    return JSON.parse(fs.readFileSync(manifestPath(projectPath), "utf-8"));
  } catch {
    return {};
  }
}

function writeManifest(projectPath, data) {
  fs.mkdirSync(skillsDir(projectPath), { recursive: true });
  fs.writeFileSync(
    manifestPath(projectPath),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}

function substitute(content, answers) {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => answers?.[key] ?? "");
}

async function fetchContent(skill) {
  if (!skill.contentUrl) return `# ${skill.name}\n(không có nội dung nguồn)`;
  const res = await fetch(skill.contentUrl);
  if (!res.ok) throw new Error(`Tải nội dung skill lỗi (${res.status})`);
  return res.text();
}

async function installSkill(skill, answers = {}) {
  const projectPath = getProjectPath();
  if (!projectPath) throw new Error("Chưa mở project nào để cài skill vào.");

  const targetDir = path.join(skillsDir(projectPath), safeDirName(skill.id));
  fs.mkdirSync(targetDir, { recursive: true });

  const rawContent = await fetchContent(skill);
  const finalContent = substitute(rawContent, answers);
  fs.writeFileSync(path.join(targetDir, "SKILL.md"), finalContent, "utf-8");

  const manifest = readManifest(projectPath);
  manifest[skill.id] = {
    version: skill.version,
    installedAt: Date.now(),
    answers,
  };
  writeManifest(projectPath, manifest);

  return { installed: true, path: targetDir };
}

function uninstallSkill(skillId) {
  const projectPath = getProjectPath();
  if (!projectPath) return false;
  fs.rmSync(path.join(skillsDir(projectPath), safeDirName(skillId)), {
    recursive: true,
    force: true,
  });
  const manifest = readManifest(projectPath);
  delete manifest[skillId];
  writeManifest(projectPath, manifest);
  return true;
}

function listInstalled() {
  const projectPath = getProjectPath();
  if (!projectPath) return {};
  return readManifest(projectPath);
}

module.exports = { installSkill, uninstallSkill, listInstalled };
