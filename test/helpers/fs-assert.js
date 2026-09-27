// fs-assert.js
// Trách nhiệm duy nhất: kiểm tra kết quả CRUD file/folder trên project đang mở
// sau khi chạy multi-turn-runner. Không đụng IPC/UI.

const fs = require("fs");
const path = require("path");
const root = (p) => path.join(__dirname, "../..", p);

function getProjectRoot() {
  const { readState } = require(root("src/main/state"));
  const { lastFolder } = readState();
  if (!lastFolder || !fs.existsSync(lastFolder)) {
    throw new Error("Chưa có project nào đang mở (state.lastFolder trống).");
  }
  return lastFolder;
}

function findFolder(projectRoot, folderName) {
  const target = path.join(projectRoot, folderName);
  return fs.existsSync(target) && fs.statSync(target).isDirectory()
    ? target
    : null;
}

// requiredExts: VD [".css", ".js"] — chỉ cần tồn tại ít nhất 1 file mỗi đuôi.
function verifyFolderHasFiles(folderName, requiredExts) {
  const projectRoot = getProjectRoot();
  const folder = findFolder(projectRoot, folderName);
  if (!folder) {
    return {
      ok: false,
      message: `Không tìm thấy folder "${folderName}" trong project.`,
    };
  }
  const files = fs.readdirSync(folder);
  const missing = requiredExts.filter(
    (ext) => !files.some((f) => f.toLowerCase().endsWith(ext)),
  );
  if (missing.length > 0) {
    return {
      ok: false,
      message: `Folder "${folderName}" thiếu file đuôi: ${missing.join(", ")}. Hiện có: ${files.join(", ") || "(rỗng)"}`,
    };
  }
  return {
    ok: true,
    message: `Folder "${folderName}" có đủ file: ${files.join(", ")}`,
  };
}

module.exports = { verifyFolderHasFiles, getProjectRoot };
