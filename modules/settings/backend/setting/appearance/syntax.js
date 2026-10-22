// syntax.js
// Schema "Syntax Highlighting". Mỗi bảng màu mang base (dark/light) riêng, độc lập theme nền.
// 1 role màu → ánh xạ sang Monaco và xterm cùng lúc (transforms/role-map.js).

module.exports = {
  id: "syntax.palette",
  group: "Appearance",
  label: "Syntax Highlighting",
  type: "select",
  default: "classic",
  order: 20,
  aiHint:
    "data = {base:'dark'|'light', comment, string, number, keyword, identifier, type, delimiter, regexp}: " +
    "hex 6 ký tự. Tuỳ chọn thêm background, foreground, cursor để đổi cả màu Terminal.",
  options: [
    {
      value: "classic",
      label: "Classic",
      data: require("./palettes/syntax/classic"),
    },
    {
      value: "pastel",
      label: "Pastel (nền sáng)",
      data: require("./palettes/syntax/pastel"),
    },
    {
      value: "vivid",
      label: "Vivid",
      data: require("./palettes/syntax/vivid"),
    },
  ],
  effects: [
    { target: "monaco.theme", payload: "$option.data", via: "syntax.monaco" },
    {
      target: "terminal.theme",
      payload: "$option.data",
      via: "syntax.terminal",
    },
  ],
};
