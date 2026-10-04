// paths.js
// Trách nhiệm duy nhất: xác định gốc project và chặn path traversal cho tool files.

const path = require("path");
const { readState } = require("../../../../src/main/state");

function getProjectRoot() {
  const { lastFolder } = readState();
  if (!lastFolder) throw new Error("Chưa mở project nào.");
  return lastFolder;
}

// Chặn path traversal ra ngoài project root (VD "../../etc/passwd").
function resolveSafePath(root, relPath) {
  const target = path.resolve(root, relPath || ".");
  const normRoot = path.resolve(root);
  if (target !== normRoot && !target.startsWith(normRoot + path.sep)) {
    throw new Error("Đường dẫn không hợp lệ (ngoài phạm vi project).");
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
