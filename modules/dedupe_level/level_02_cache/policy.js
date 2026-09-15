// policy.js
// Nguồn chân lý DUY NHẤT cho level 2: action nào cache được xuyên turn (biết cách
// invalidate), action nào là mutation phải đánh dấu dirty. Thêm action mới chỉ sửa ở đây.

const CACHEABLE = new Set(["files:tree", "files:read"]);
const MUTATING = new Set(["files:write", "files:move", "files:delete"]);

function isCacheable(toolName, action) {
  return CACHEABLE.has(`${toolName}:${action}`);
}

function isMutating(toolName, action) {
  return MUTATING.has(`${toolName}:${action}`);
}

module.exports = { isCacheable, isMutating };
