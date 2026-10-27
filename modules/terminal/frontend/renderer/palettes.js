export const DEFAULT_OPTIONS = {
  fontSize: 13,
  fontFamily: "'Cascadia Code', 'Consolas', 'Courier New', monospace",
  tabStopWidth: 4,
  cursorBlink: true,
  scrollback: 5000,
};

const files = import.meta.glob("@modules/terminal/shared/themes/*.json", {
  eager: true,
  import: "default",
});

export const PALETTES = Object.fromEntries(
  Object.entries(files).map(([file, theme]) => [
    file.split("/").pop().replace(".json", ""),
    theme.colors,
  ]),
);