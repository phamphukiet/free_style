// registry.js
// Trách nhiệm duy nhất: lưu định nghĩa setting trong bộ nhớ.
// Cho phép đăng ký thêm setting lúc runtime (VD: từ lệnh của AI/agent) mà không cần sửa code.

const { getDefaultDefinitions } = require("./schema");

const definitions = new Map();
getDefaultDefinitions().forEach((d) => definitions.set(d.id, d));

function registerDefinition(def) {
  const existing = definitions.get(def.id) || {};
  definitions.set(def.id, { ...existing, ...def });
  return definitions.get(def.id);
}

function getDefinition(id) {
  return definitions.get(id);
}

function getAllDefinitions() {
  return Array.from(definitions.values());
}

module.exports = { registerDefinition, getDefinition, getAllDefinitions };
