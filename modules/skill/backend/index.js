// index.js
const { registerSkillIpc } = require("./ipc");

function registerSkillBackend() {
  registerSkillIpc();
}

module.exports = { registerSkillBackend };
