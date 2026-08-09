// theme.schema.js
// 2 theme dựng sẵn — không thể xoá, dùng làm fallback khi theme custom
// thiếu token nào đó (tránh vỡ giao diện nếu agent chỉ đổi 1-2 màu).

const BUILTIN_THEMES = {
  dark: {
    label: "Dark (mặc định)",
    tokens: {
      "--bg-primary": "#1e1e1e",
      "--bg-secondary": "#252526",
      "--bg-elevated": "#333333",
      "--bg-hover": "#2a2d2e",
      "--text-primary": "#cccccc",
      "--text-muted": "#858585",
      "--accent": "#007acc",
      "--border": "#3a3a3a",
    },
  },
  light: {
    label: "Light",
    tokens: {
      "--bg-primary": "#ffffff",
      "--bg-secondary": "#f3f3f3",
      "--bg-elevated": "#e8e8e8",
      "--bg-hover": "#e4e6f1",
      "--text-primary": "#1e1e1e",
      "--text-muted": "#6b6b6b",
      "--accent": "#005fb8",
      "--border": "#d4d4d4",
    },
  },
};

module.exports = { BUILTIN_THEMES };
