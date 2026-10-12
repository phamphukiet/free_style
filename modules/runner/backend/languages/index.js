// modules/runner/backend/languages/index.js
// Nạp mọi file *.js trong thư mục này. Thêm ngôn ngữ = thêm 1 file, xoá = xoá file.
const fs = require("fs");
const path = require("path");

const languages = fs
  .readdirSync(__dirname)
  .filter((f) => f.endsWith(".js") && f !== "index.js")
  .map((f) => require(path.join(__dirname, f)));

const byId = (id) => languages.find((l) => l.id === id) || null;

function byFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return languages.find((l) => l.extensions.includes(ext)) || null;
}

module.exports = { byId, byFile };
