// behavior.js
module.exports = [
  {
    id: "extension.autoReload",
    group: "Extension",
    label: "Tự nạp lại khi file code bị sửa",
    description: "Tắt thì chỉ nạp lại khi lưu từ trang ext.",
    type: "boolean",
    default: true,
    order: 20,
    scope: "global",
  },
];
