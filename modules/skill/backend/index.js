// index.js
const { registerSkillIpc } = require("./ipc");

function register() {
  registerSkillIpc();
}

module.exports = { register };
