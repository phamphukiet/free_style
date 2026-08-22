// ipc.js
// Đăng ký toàn bộ IPC handler cho module skill. Logic thật nằm ở
// platforms-store / skills-store / search / install — file này chỉ forward.

const { ipcMain } = require("electron");
const platformsStore = require("./platforms-store");
const skillsStore = require("./skills-store");
const { testConnection } = require("./connector");
const { searchAll } = require("./search");
const { installSkill, uninstallSkill, listInstalled } = require("./install");

function registerSkillIpc() {
  // Platforms
  ipcMain.handle("skill:platforms-list", () => platformsStore.list());
  ipcMain.handle("skill:platform-test", (e, endpoint) =>
    testConnection(endpoint),
  );
  ipcMain.handle("skill:platform-save", async (e, platform) => {
    const result = await testConnection(platform.endpoint);
    if (!result.success) return { success: false, message: result.message };
    return { success: true, platform: platformsStore.save(platform) };
  });
  ipcMain.handle("skill:platform-delete", (e, id) => platformsStore.remove(id));

  // Catalog & search
  ipcMain.handle("skill:search", (e, query, sortBy) =>
    searchAll(query, sortBy),
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
      skillsStore.upsert(skill); // đảm bảo có trong catalog trước khi cài
      return await installSkill(skill, answers);
    } catch (error) {
      return { installed: false, message: error.message };
    }
  });
  ipcMain.handle("skill:uninstall", (e, skillId) => uninstallSkill(skillId));
  ipcMain.handle("skill:list-installed", () => listInstalled());
}

module.exports = { registerSkillIpc };
