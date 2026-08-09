// schema.js
// Trách nhiệm duy nhất: khai báo các setting mặc định của app.
// Muốn thêm setting mới lúc build (không phải runtime) thì sửa ở đây.

function getDefaultDefinitions() {
  return [
    {
      id: "workbench.theme",
      group: "Appearance",
      label: "Color Theme",
      description: "Chọn theme màu cho giao diện workbench.",
      type: "enum",
      options: [
        { value: "dark", label: "Dark (mặc định)" },
        { value: "light", label: "Light" },
      ],
      default: "dark",
    },
  ];
}

module.exports = { getDefaultDefinitions };
