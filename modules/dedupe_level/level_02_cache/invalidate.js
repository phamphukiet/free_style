// invalidate.js
// Trách nhiệm duy nhất: theo dõi "dirty" (tree + từng path bị ghi/xoá/di chuyển)
// và quyết định 1 cache entry còn dùng được hay không.

const sessionStore = require("../../chat/backend/session-store");

function readDirty(sessionId) {
  const session = sessionStore.get(sessionId);
  return session?.toolDirty || { tree: false, paths: [] };
}

function writeDirty(sessionId, dirty) {
  const session = sessionStore.get(sessionId);
  if (!session) return;
  sessionStore.save({ ...session, toolDirty: dirty });
}

function markTreeDirty(sessionId) {
  writeDirty(sessionId, { ...readDirty(sessionId), tree: true });
}

function markPathDirty(sessionId, relPath) {
  const dirty = readDirty(sessionId);
  if (dirty.paths.includes(relPath)) return;
  writeDirty(sessionId, { ...dirty, paths: [...dirty.paths, relPath] });
}

function clearTreeDirty(sessionId) {
  writeDirty(sessionId, { ...readDirty(sessionId), tree: false });
}

function clearPathDirty(sessionId, relPath) {
  const dirty = readDirty(sessionId);
  writeDirty(sessionId, {
    ...dirty,
    paths: dirty.paths.filter((p) => p !== relPath),
  });
}

// Cache entry (files:tree / files:read) còn hợp lệ không.
function isValid(sessionId, toolName, action, args) {
  const dirty = readDirty(sessionId);
  if (toolName === "files" && action === "tree") return !dirty.tree;
  if (toolName === "files" && action === "read")
    return !dirty.paths.includes(args.path);
  return true;
}

module.exports = {
  markTreeDirty,
  markPathDirty,
  clearTreeDirty,
  clearPathDirty,
  isValid,
};
