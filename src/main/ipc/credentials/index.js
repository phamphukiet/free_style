// index.js
// Trách nhiệm duy nhất: đăng ký toàn bộ IPC handler liên quan credentials.
// Logic thật nằm ở list.js / save.js / load.js / delete.js.

const { registerListHandler } = require("./list");
const { registerSaveHandler } = require("./save");
const { registerLoadHandler } = require("./load");
const { registerDeleteHandler } = require("./delete");

function registerCredentialsIpc() {
  registerListHandler();
  registerSaveHandler();
  registerLoadHandler();
  registerDeleteHandler();
}

module.exports = { registerCredentialsIpc };
