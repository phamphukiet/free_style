// table.js — DỮ LIỆU: setting hay dùng → lệnh nhanh (0 request AI).
// select: names[0] = lệnh, còn lại là alias; giá trị lấy từ phần còn lại của câu.
// toggle: names = tên setting; tự sinh "bật <tên>" và "tắt <tên>".
// Thêm lệnh = thêm 1 dòng. Chỉ nên thêm 2–3 setting hay dùng.

module.exports = [
  {
    id: "appearance.theme",
    kind: "select",
    names: ["chuyển theme", "đổi theme", "đặt theme"],
  },
  {
    id: "syntax.palette",
    kind: "select",
    names: ["chuyển syntax", "đổi syntax", "đổi màu code"],
  },
  // TODO: thay bằng id thật của auto save (xem list({query:"save"}))
  {
    id: "editor.autoSave",
    kind: "toggle",
    names: ["auto save", "tự động lưu"],
  },
];
