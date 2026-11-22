// entity.js: cho chat tìm file/thư mục trong project theo tên người dùng gõ.
// "path" = file hoặc thư mục, "folder" = chỉ thư mục.

const fs = require("fs");
const path = require("path");
const {
  registerCapability,
} = require("../../../shared/core/capability-registry.js");
const { rank } = require("../../../shared/command/rank.js");
const { getProjectRoot } = require("./tool/paths");
const { SKIP } = require("./tool/tree");

const MAX_SCAN = 5000;

function scan({ dir, root, out }) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name) || out.length >= MAX_SCAN) continue;
    const full = path.join(dir, e.name);
    const rel = path.relative(root, full).replace(/\\/g, "/");
    out.push({
      key: rel,
      label: rel,
      isDir: e.isDirectory(),
      names: [rel, e.name],
    });
    if (e.isDirectory()) scan({ dir: full, root, out });
  }
}

const finder =
  ({ accept }) =>
  ({ text }) => {
    const root = getProjectRoot();
    const all = [];
    scan({ dir: root, root, out: all });
    return rank({ items: all.filter(accept), text });
  };

function registerFilesEntities() {
  registerCapability({
    id: "path",
    kind: "entity",
    find: finder({ accept: () => true }),
  });
  registerCapability({
    id: "folder",
    kind: "entity",
    find: finder({ accept: (i) => i.isDir }),
  });
}

module.exports = { registerFilesEntities };
