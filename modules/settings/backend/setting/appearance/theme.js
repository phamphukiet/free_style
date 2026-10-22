// theme.js
// Schema "Color Theme". Palette là DỮ LIỆU ở palettes/theme/ — 1 nguồn duy nhất.
// Mẫu user/AI thêm có dạng seed 6 màu; transform "theme.vars" mở rộng thành đủ biến CSS.

module.exports = {
  id: "appearance.theme",
  group: "Appearance",
  label: "Color Theme",
  type: "select",
  default: "dark",
  order: 10,
  aiHint:
    "data = {bg, bgElevated, text, textMuted, accent, border}: hex 6 ký tự, KHÔNG có '#'. " +
    "Chọn màu theo mô tả (VD 'chống ánh sáng xanh' → tông ấm vàng/cam/nâu, tránh xanh dương).",
  options: [
    { value: "dark", label: "Dark", data: require("./palettes/theme/dark") },
    { value: "light", label: "Light", data: require("./palettes/theme/light") },
    {
      value: "monokai",
      label: "Monokai",
      data: require("./palettes/theme/monokai"),
    },
  ],
  effects: [
    { target: "css.vars", payload: "$option.data", via: "theme.vars" },
    {
      target: "monaco.theme",
      payload: "$option.data",
      via: "theme.monacoBase",
    },
  ],
};