// index.js
// Điểm export duy nhất — main/ipc.js chỉ cần gọi registerChatBackend().
// Logic thật (session CRUD, send pipeline, capability registry) nằm ở strategy/.
module.exports = require("./strategy/index.js");
