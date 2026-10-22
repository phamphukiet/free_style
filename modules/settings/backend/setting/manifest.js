// manifest.js
// Owner = tiền tố id. Giữ id cũ (appearance.theme, syntax.palette) để không mất giá trị đã lưu.
module.exports = [
  { owner: "appearance", settings: [require("./appearance/theme")] },
  { owner: "syntax", settings: [require("./appearance/syntax")] },
];
