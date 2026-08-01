const fs = require("fs");

function readTextFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error("Lỗi đọc file:", error);
    return "";
  }
}

function writeTextFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
    return true;
  } catch (error) {
    console.error("Lỗi ghi file:", error);
    return false;
  }
}

module.exports = {
  readTextFile,
  writeTextFile,
};
