// values.js
// Đọc/ghi giá trị trên shared/storage (namespace "settings", 2 tầng global/workspace).
// Chỉ lưu giá trị khác default — việc đó do engine quyết định (truyền null = xoá).

function createValues({ store }) {
  return {
    // Chụp 1 lần cho cả lô, tránh clone entries lặp lại theo từng setting.
    snapshot: () => ({
      global: store.entries({ scope: "global" }),
      workspace: store.entries({ scope: "workspace" }),
    }),
    write: ({ id, value, scope }) => store.set({ key: id, value, scope }),
    remove: ({ id, scope }) => store.delete({ key: id, scope }),
  };
}

module.exports = { createValues };
