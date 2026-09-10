// agent-prompt.js
// Trách nhiệm duy nhất: gom nội dung các skill đã cài trong project, đang
// gán cho agentId, thành 1 khối text nhúng vào system prompt — mirror cách
// rule/backend build system prompt cho rule.

const path = require("path");
const fs = require("fs");
const { readState } = require("../../../src/main/state");
const skillsStore = require("./catalog/skills-store");
const { listInstalled } = require("./install/install");

function getProjectPath() {
  const { lastFolder } = readState();
  if (!lastFolder || !fs.existsSync(lastFolder)) return null;
  return lastFolder;
}

// Trùng quy tắc safeDirName trong install.js — Windows cấm ':' trong tên thư mục.
function safeDirName(id) {
  return id.replace(/[:*?"<>|]/g, "_");
}

function readSkillFiles(targetDir) {
  try {
    return fs
      .readdirSync(targetDir, { withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => {
        try {
          return fs.readFileSync(path.join(targetDir, e.name), "utf-8");
        } catch {
          return "";
        }
      })
      .filter(Boolean)
      .join("\n\n");
  } catch {
    return ""; // thư mục không tồn tại / không đọc được -> bỏ qua an toàn
  }
}

function buildSkillPrompt(agentId) {
  if (!agentId) return "";
  const projectPath = getProjectPath();
  if (!projectPath) return "";

  const installed = listInstalled();
  const blocks = Object.keys(installed)
    .map((id) => skillsStore.get(id))
    .filter((skill) => skill && (skill.agentIds || []).includes(agentId))
    .map((skill) => {
      const targetDir = path.join(
        projectPath,
        ".vibe",
        "skills",
        safeDirName(skill.id),
      );
      const content = readSkillFiles(targetDir);
      return content ? `## Skill: ${skill.name}\n${content}` : "";
    })
    .filter(Boolean);

  return blocks.join("\n\n");
}

module.exports = { buildSkillPrompt };
