// code-letter.schema.js
// Danh sách lựa chọn cho font/tab/theme của editor & terminal —
// chỉ chứa value/label để hiển thị dropdown; màu thực tế (terminal theme)
// và theme Monaco built-in do phía frontend (nơi tạo instance) tự biết.

const FONT_FAMILIES = [
  { value: "Consolas, 'Courier New', monospace", label: "Consolas" },
  { value: "'Fira Code', monospace", label: "Fira Code" },
  { value: "'JetBrains Mono', monospace", label: "JetBrains Mono" },
  { value: "'Cascadia Code', monospace", label: "Cascadia Code" },
  { value: "monospace", label: "Monospace (mặc định OS)" },
];

const TAB_SIZES = ["2", "3", "4", "8"].map((n) => ({
  value: n,
  label: `${n} spaces`,
}));

const EDITOR_THEMES = [
  { value: "vs-dark", label: "Dark" },
  { value: "vs-light", label: "Light" },
  { value: "hc-black", label: "High Contrast" },
];

const TERMINAL_THEMES = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "monokai", label: "Monokai" },
];

module.exports = { FONT_FAMILIES, TAB_SIZES, EDITOR_THEMES, TERMINAL_THEMES };
