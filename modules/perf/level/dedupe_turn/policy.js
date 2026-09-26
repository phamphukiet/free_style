// policy.js — action nào cacheable trong CÙNG 1 lượt gọi AI (đọc thuần, không side-effect).
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
