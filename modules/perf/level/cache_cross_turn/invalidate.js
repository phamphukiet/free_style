// invalidate.js
// Theo dõi "dirty" (tree + từng path bị ghi/xoá/di chuyển) qua perf-store riêng —
// KHÔNG đụng session của chat (khác bản gốc dedupe_level).

const store = require("../../backend/store");

function readDirty(sessionId) {
  return store.get(sessionId).dirty || { tree: false, paths: [] };
}

function writeDirty(sessionId, dirty) {
  store.patch(sessionId, { dirty });
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
