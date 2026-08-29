// dir-size.js
// Tính tổng dung lượng thư mục đệ quy, bỏ qua node_modules/.git.

const path = require("path");
const fs = require("fs");

const SKIP = new Set(["node_modules", ".git", ".venv", "dist", "out"]);

function calcDirSize(dirPath) {
  let total = 0;
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const e of entries) {
      if (SKIP.has(e.name)) continue;
      const full = path.join(dirPath, e.name);
      if (e.isDirectory()) total += calcDirSize(full);
      else { try { total += fs.statSync(full).size; } catch { /* ignore */ } }
    }
  } catch { /* ignore permission errors */ }
  return total;
}

module.exports = { calcDirSize };
