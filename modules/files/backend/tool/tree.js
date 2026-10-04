// tree.js
// Trách nhiệm duy nhất: liệt kê cấu trúc thư mục project dạng cây.

const path = require("path");
const fs = require("fs");
const { getProjectRoot } = require("./paths");

const SKIP = new Set(["node_modules", ".git", ".venv", "dist", "out", ".vibe"]);

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

module.exports = { tree };
