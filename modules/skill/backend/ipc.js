// ipc.js
// Đăng ký toàn bộ IPC handler cho module skill. Logic thật nằm ở
// platforms-store / skills-store / search / install — file này chỉ forward.

const { ipcMain } = require("electron");
const platformsStore = require("./platform/platforms-store");
const skillsStore = require("./catalog/skills-store");
const { searchAll } = require("./catalog/search");
const { installSkill, uninstallSkill, listInstalled } = require("./install/install");
const { syncPinnedSkills } = require("./install/auto-install");
const { listProjectSkills } = require("./install/project-skills");
const { addPlatform } = require("./platform/add-platform");
const { searchOnPlatform, resolveSkillSource,} = require("./platform/connector");

function registerSkillIpc() {
  // Platforms
  ipcMain.handle("skill:platform-delete", (e, id) => platformsStore.remove(id));

  // Catalog & search
  ipcMain.handle("skill:search", (e, query, sortBy, platformId) =>
    searchAll(query, sortBy, platformId),
  );
  ipcMain.handle("skill:catalog-get", (e, id) => skillsStore.get(id));
  ipcMain.handle("skill:catalog-upsert", (e, skill) =>
    skillsStore.upsert(skill),
  );
  ipcMain.handle("skill:catalog-delete", (e, id) => skillsStore.remove(id));
  ipcMain.handle("skill:assign-agents", (e, id, agentIds) =>
    skillsStore.assignAgents(id, agentIds),
  );
  ipcMain.handle("skill:list-by-agent", (e, agentId) =>
    skillsStore.listByAgent(agentId),
  );

  // Install vào project
  ipcMain.handle("skill:install", async (e, skill, answers) => {
    try {
      const { files } = await resolveSkillSource(skill);
      const finalSkill = files ? { ...skill, files } : skill;
      skillsStore.upsert(skill); // catalog KHÔNG lưu nội dung file, tránh phình json
      return await installSkill(finalSkill, answers);
    } catch (error) {
      return { installed: false, message: error.message };
    }
  });
  ipcMain.handle("skill:uninstall", (e, skillId) => uninstallSkill(skillId));
  ipcMain.handle("skill:list-installed", () => listInstalled());
  ipcMain.handle("skill:toggle-pin", (e, id) => skillsStore.togglePin(id));
  ipcMain.handle("skill:sync-pinned", () => syncPinnedSkills());
  ipcMain.handle("skill:list-pinned", () => skillsStore.listPinned());
  
  ipcMain.handle("skill:list-project", () => listProjectSkills());
  ipcMain.handle("skill:add-platform", async (e, input) => {
    try {
      return { success: true, platform: await addPlatform(input) };
      } catch (error) {
        return { success: false, message: error.message };
      }
    });
  ipcMain.handle("skill:platform-rename", (e, id, name) =>
      platformsStore.save({ id, name }),
    );
}

module.exports = { registerSkillIpc };
