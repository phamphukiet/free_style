// index.js — điểm vào duy nhất của lệnh nhanh cho setting.
const { listQuickCommands } = require("./build");
const { registerOptionFinders } = require("./entity");

module.exports = {
  listQuickCommands,
  registerQuickCommands: registerOptionFinders,
};
