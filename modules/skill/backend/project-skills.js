// project-skills.js
// Trách nhiệm duy nhất: ghép manifest cài đặt (install.js — chỉ có id/version)
// với metadata catalog (skills-store.js — có name) để sidebar hiển thị được tên.

const { listInstalled } = require("./install");
const skillsStore = require("./skills-store");

function listProjectSkills() {
  const manifest = listInstalled();
  return Object.entries(manifest).map(([id, info]) => {
    const skill = skillsStore.get(id);
    return {
      id,
      name: skill?.name || id,
      version: info.version,
      installedAt: info.installedAt,
    };
  });
}

module.exports = { listProjectSkills };
