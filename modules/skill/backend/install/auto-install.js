// Trách nhiệm duy nhất: cài tự động skill "pinned" nào chưa có trong project.
const skillsStore = require("../catalog/skills-store");
const { installSkill, listInstalled } = require("./install");

async function syncPinnedSkills() {
  const pinned = skillsStore.listPinned();
  const installed = listInstalled();
  const results = [];
  for (const skill of pinned) {
    if (installed[skill.id]) continue;
    try {
      results.push({ id: skill.id, ...(await installSkill(skill, {})) });
    } catch (error) {
      results.push({ id: skill.id, installed: false, message: error.message });
    }
  }
  return results;
}

module.exports = { syncPinnedSkills };
