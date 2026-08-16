// User/AI KHÔNG sửa file này để đổi id/type; chỉ đổi value (settings:set)
// hoặc thêm mẫu mới vào options (settings:add-preset, lưu ở store).
module.exports = {
  id: "appearance.theme",
  group: "Appearance",
  label: "Color Theme",
  type: "select",
  default: "dark",
  options: [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "monokai", label: "Monokai" },
  ],
};
