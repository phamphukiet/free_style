// discover.js
// Trách nhiệm duy nhất: tự tìm mọi file *.test.js trong .agents/test/ (trừ lib/).
// Nhờ vậy thêm/xoá 1 test không cần đụng run.js.

const fs = require("fs");
const path = require("path");

const TEST_ROOT = path.resolve(__dirname, "..");

function walk(dir, found) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "lib") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, found);
    } else if (entry.name.endsWith(".test.js")) {
      found.push(full);
    }
  }
  return found;
}

function discoverTestFiles() {
  return walk(TEST_ROOT, []);
}

module.exports = { discoverTestFiles, TEST_ROOT };
