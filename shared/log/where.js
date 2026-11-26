// where.js
// Từ đường dẫn file suy ra: module hiển thị, owner (id module để kiểm tra đóng băng), tên file.
// modules/<id>/... → module = owner = <id>. src/<part>/... → module = <part>. shared/... → "shared".

const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const NESTED = new Set(["modules", "src"]); // thư mục gốc mà đoạn thứ 2 mới là tên

/** @param {{ filename: string, root?: string }} args */
function whereOf({ filename, root = ROOT }) {
  const [top, second] = path.relative(root, filename).split(path.sep);
  return {
    module: NESTED.has(top) ? second : top,
    owner: top === "modules" ? second : null,
    file: path.basename(filename),
  };
}

module.exports = { ROOT, whereOf };
