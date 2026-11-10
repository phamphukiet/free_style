// catalog.js
// Bộ nhớ RAM: thông tin đọc từ code ext (name, manifest đã mở rộng, lỗi nạp, code đã nạp).
// Không lưu xuống đĩa — luôn dựng lại từ file code.

/** @typedef {{ name: string, manifest: object|null, error: string|null, code: string }} ExtensionInfo */
function createCatalog() {
  const infos = new Map();
  return {
    get: ({ id }) => infos.get(id) ?? null,
    set: ({ id, info }) => {
      infos.set(id, info);
    },
    remove: ({ id }) => {
      infos.delete(id);
    },
  };
}

module.exports = { createCatalog };
