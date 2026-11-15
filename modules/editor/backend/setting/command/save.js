// save.js
// Các lệnh liên quan đến lưu file. Ext gọi bằng commands.editor.<tên lệnh>().
// Thêm lệnh lưu mới (VD saveCurrent) thì viết tiếp vào file này.

module.exports = {
  saveAll: {
    label: "Lưu tất cả file đã sửa",
    runIn: "renderer", // model Monaco nằm ở renderer
  },
};
