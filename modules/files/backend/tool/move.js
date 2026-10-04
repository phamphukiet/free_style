// move.js
// Trách nhiệm duy nhất: chuyển nhiều file/thư mục vào 1 thư mục đích (tự tạo nếu chưa có).

const path = require("path");
const fs = require("fs");
const {
  getProjectRoot,
  resolveSafePath,
  resolveChildPath,
} = require("./paths");
const { toPaths, assertUnique, runEach, summarize } = require("./batch");

function planMove(root, rel, destDir, destFolder) {
  const src = resolveChildPath(root, rel);
  if (!fs.existsSync(src)) throw new Error(`"${rel}" không tồn tại.`);
  const name = path.basename(src);
  return {
    rel,
    src,
    dest: path.join(destDir, name),
    to: path.join(destFolder, name).replace(/\\/g, "/"),
  };
}

function moveOne({ src, dest, to }) {
  if (dest === src) return { to, note: "đã ở đúng thư mục đích" };
  if (fs.existsSync(dest)) throw new Error(`"${to}" đã tồn tại.`);
  fs.renameSync(src, dest);
  return { to };
}

function move(args) {
  const rels = toPaths(args);
  if (!args.destFolder) throw new Error("Thiếu tham số destFolder.");
  const root = getProjectRoot();
  const destDir = resolveSafePath(root, args.destFolder);
  const plans = rels.map((rel) =>
    planMove(root, rel, destDir, args.destFolder),
  );
  assertUnique(
    plans.map((p) => p.src),
    "đường dẫn nguồn",
  );
  assertUnique(
    plans.map((p) => p.dest),
    "tên đích",
  );
  fs.mkdirSync(destDir, { recursive: true });
  return summarize(
    "chuyển",
    runEach(plans, (p) => p.rel, moveOne),
  );
}

module.exports = { move };