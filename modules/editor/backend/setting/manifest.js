// manifest.js
// Tự quét thư mục: thêm setting mới = thêm 1 file ở đây, không sửa manifest.
const fs = require("fs");
const path = require("path");

const SKIP = new Set(["manifest.js", "target.js"]);
const isSettingFile = (name) => name.endsWith(".js") && !SKIP.has(name);

const settings = fs
  .readdirSync(__dirname)
  .filter(isSettingFile)
  .sort()
  .flatMap((name) => require(path.join(__dirname, name)));

module.exports = { owner: "editor", settings };