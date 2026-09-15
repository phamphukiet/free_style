// policy.js
// Nguồn chân lý DUY NHẤT: tool+action nào được phép cache (đọc thuần, không side-effect).
// Thêm tool mới có action đọc: thêm 1 dòng ở đây, không sửa wrap-executor.js.

const CACHEABLE = new Set([
  "files:tree",
  "files:read",
  "kanban:list",
  "agent:list",
  "rule:list",
  "skill:list",
]);

function isCacheable(toolName, action) {
  return CACHEABLE.has(`${toolName}:${action}`);
}

module.exports = { isCacheable };
