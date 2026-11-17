// paths.js
// Trách nhiệm duy nhất: xác định gốc project và chặn path traversal cho tool files.

const path = require("path");
const { readState } = require("../../../../src/main/state");

function getProjectRoot() {
  const { lastFolder } = readState();
  if (!lastFolder) throw new Error("Chưa mở project nào.");
  return lastFolder;
}

const PROTECTED_TOP = new Set([".vibe", ".git"]);

function resolveSafePath(root, relPath) {
  const target = path.resolve(root, relPath || ".");
  const normRoot = path.resolve(root);
  if (target !== normRoot && !target.startsWith(normRoot + path.sep)) {
    throw new Error("Đường dẫn không hợp lệ (ngoài phạm vi project).");
  }
  const top = path.relative(normRoot, target).split(path.sep)[0].toLowerCase();
  if (PROTECTED_TOP.has(top)) {
    throw new Error(`"${top}" là vùng được bảo vệ, AI không được truy cập.`);
  }
  return target;
}

// Dùng cho ghi/xoá/chuyển nguồn: cấm trỏ vào chính thư mục gốc (VD ".").
function resolveChildPath(root, relPath) {
  const target = resolveSafePath(root, relPath);
  if (target === path.resolve(root)) {
    throw new Error("Không được thao tác trên thư mục gốc project.");
  }
  return target;
}

module.exports = { getProjectRoot, resolveSafePath, resolveChildPath };
