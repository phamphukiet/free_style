// file.js
// Lệnh file cho chat, dùng lại tool/actions.js. Lệnh remove là danger:
// bus chỉ cho chạy khi chat đã hỏi user, nên gọi actions.remove với confirmed: true.

const fs = require("fs");
const actions = require("../../tool/actions.js");
const { getProjectRoot, resolveChildPath } = require("../../tool/paths");

const PATHS = { type: "string", many: true, entity: "path" };

const fromBatch = ({ results }) => ({
  items: results.map(({ path, ok, error }) => ({ key: path, ok, error })),
});

// Không ghi đè file đã có: mục trùng bị báo lỗi, các mục còn lại vẫn tạo.
function createEmpty({ names }) {
  const root = getProjectRoot();
  const fresh = names.filter((n) => !fs.existsSync(resolveChildPath(root, n)));
  const files = fresh.map((path) => ({ path, content: "" }));
  const written = files.length ? actions.write({ files }).results : [];
  const skipped = names
    .filter((n) => !fresh.includes(n))
    .map((path) => ({ path, ok: false, error: "đã tồn tại" }));
  return fromBatch({ results: [...written, ...skipped] });
}

module.exports = {
  create: {
    label: "Tạo file trống",
    aliases: ["tạo file"],
    runIn: "main",
    args: { names: { type: "string", many: true } },
    run: createEmpty,
  },
  move: {
    label: "Chuyển file",
    aliases: ["chuyển", "di chuyển"],
    runIn: "main",
    args: { paths: PATHS, destFolder: { type: "string", entity: "folder" } },
    run: (args) => fromBatch(actions.move(args)),
  },
  remove: {
    label: "Xoá file",
    aliases: ["xoá"],
    runIn: "main",
    danger: true,
    args: { paths: PATHS },
    run: ({ paths }) => fromBatch(actions.remove({ paths, confirmed: true })),
  },
};
