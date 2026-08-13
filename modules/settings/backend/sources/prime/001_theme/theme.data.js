// Gộp: định nghĩa theme dựng sẵn + whitelist token + đọc/ghi theme custom.
const { app } = require("electron");
const path = require("path");
const fs = require("fs");

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

const TOKEN_KEYS = Object.keys(BUILTIN_THEMES.dark.tokens);
const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const CUSTOM_FILE = path.join(app.getPath("userData"), "custom-themes.json");
function readCustomThemes() {
  try {
    return JSON.parse(fs.readFileSync(CUSTOM_FILE, "utf-8"));
  } catch {
    return {};
  }
}
function writeCustomThemes(themes) {
  fs.writeFileSync(CUSTOM_FILE, JSON.stringify(themes, null, 2), "utf-8");
}

module.exports = {
  BUILTIN_THEMES,
  TOKEN_KEYS,
  HEX_COLOR_RE,
  readCustomThemes,
  writeCustomThemes,
};
