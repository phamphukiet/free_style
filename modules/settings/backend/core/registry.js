// core/registry.js
// Lưu định nghĩa setting trong bộ nhớ. KHÔNG tự nạp default nào —
// mọi định nghĩa đều do sources/* tự đăng ký lúc init().

const definitions = new Map();

function registerDefinition(def) {
  const existing = definitions.get(def.id) || {};
  const merged = { origin: "custom", locked: false, ...existing, ...def };
  definitions.set(def.id, merged);
  return merged;
}

function unregisterDefinition(id) {
  const def = definitions.get(id);
  if (!def) return false;
  if (def.locked)
    throw new Error(
      `Setting "${id}" thuộc origin="${def.origin}", không thể xoá`,
    );
  return definitions.delete(id);
}

function getDefinition(id) {
  return definitions.get(id);
}
function getAllDefinitions() {
  return Array.from(definitions.values());
}

module.exports = {
  registerDefinition,
  unregisterDefinition,
  getDefinition,
  getAllDefinitions,
};
