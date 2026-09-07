// actions.js
// Trách nhiệm duy nhất: đọc cấu trúc thư mục & nội dung file trong project
// đang mở, phục vụ AI tool "files". Không đụng IPC, không đụng UI.

const path = require("path");
const fs = require("fs");
const { readState } = require("../../../../src/main/state");

const SKIP = new Set(["node_modules", ".git", ".venv", "dist", "out"]);
const MAX_READ_BYTES = 200 * 1024; // 200KB, tránh tràn context AI

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

function buildTree(dirPath, depth, maxDepth) {
  if (depth > maxDepth) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((e) => !SKIP.has(e.name))
    .sort(
      (a, b) =>
        Number(b.isDirectory()) - Number(a.isDirectory()) ||
        a.name.localeCompare(b.name),
    )
    .map((e) => {
      const full = path.join(dirPath, e.name);
      if (!e.isDirectory()) return { name: e.name, type: "file" };
      return {
        name: e.name,
        type: "folder",
        children: buildTree(full, depth + 1, maxDepth),
      };
    });
}

function treeToText(nodes, prefix = "") {
  return nodes
    .map((n, i) => {
      const isLast = i === nodes.length - 1;
      const line =
        prefix +
        (isLast ? "└── " : "├── ") +
        n.name +
        (n.type === "folder" ? "/" : "");
      const childPrefix = prefix + (isLast ? "    " : "│   ");
      const childText = n.children?.length
        ? "\n" + treeToText(n.children, childPrefix)
        : "";
      return line + childText;
    })
    .join("\n");
}

function tree({ maxDepth = 5 } = {}) {
  const root = getProjectRoot();
  const nodes = buildTree(root, 0, maxDepth);
  return {
    root: path.basename(root),
    structure: treeToText(nodes) || "(thư mục rỗng)",
  };
}

function read({ path: relPath }) {
  if (!relPath) throw new Error("Thiếu tham số path.");
  const root = getProjectRoot();
  const fullPath = resolveSafePath(root, relPath);
  const stat = fs.statSync(fullPath);
  if (stat.isDirectory())
    throw new Error(`"${relPath}" là thư mục, không phải file.`);
  if (stat.size > MAX_READ_BYTES) {
    throw new Error(
      `File quá lớn (${(stat.size / 1024).toFixed(0)}KB), giới hạn ${MAX_READ_BYTES / 1024}KB.`,
    );
  }
  return { path: relPath, content: fs.readFileSync(fullPath, "utf-8") };
}

function write({ path: relPath, content }) {
  if (!relPath) throw new Error("Thiếu tham số path.");
  if (typeof content !== "string") throw new Error("Thiếu tham số content.");
  const root = getProjectRoot();
  const fullPath = resolveSafePath(root, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  const existed = fs.existsSync(fullPath);
  fs.writeFileSync(fullPath, content, "utf-8");
  return {
    message: `Đã ${existed ? "ghi đè" : "tạo"} file "${relPath}".`,
    path: relPath,
  };
}

function remove({ path: relPath, confirmed }) {
  if (!relPath) throw new Error("Thiếu tham số path.");
  const root = getProjectRoot();
  const fullPath = resolveSafePath(root, relPath);
  if (!fs.existsSync(fullPath))
    throw new Error(`File "${relPath}" không tồn tại.`);
  if (!confirmed) {
    return {
      needsConfirmation: true,
      message: `Xác nhận xoá "${relPath}"? Nếu người dùng đồng ý, gọi lại với confirmed=true.`,
    };
  }
  fs.rmSync(fullPath, { recursive: true, force: true });
  return { message: `Đã xoá "${relPath}".` };
}

function move({ path: relPath, destFolder }) {
  if (!relPath) throw new Error("Thiếu tham số path.");
  if (!destFolder) throw new Error("Thiếu tham số destFolder.");
  const root = getProjectRoot();
  const srcPath = resolveSafePath(root, relPath);
  if (!fs.existsSync(srcPath)) throw new Error(`"${relPath}" không tồn tại.`);

  const destDir = resolveSafePath(root, destFolder);
  fs.mkdirSync(destDir, { recursive: true });

  const name = path.basename(srcPath);
  const destPath = path.join(destDir, name);
  if (destPath === srcPath)
    return { message: `"${relPath}" đã ở trong "${destFolder}".` };
  if (fs.existsSync(destPath))
    throw new Error(`"${destFolder}/${name}" đã tồn tại.`);

  fs.renameSync(srcPath, destPath);
  const newRelPath = path.join(destFolder, name).replace(/\\/g, "/");
  return {
    message: `Đã chuyển "${relPath}" vào "${destFolder}".`,
    path: newRelPath,
  };
}

module.exports = { tree, read, write, remove, move };
