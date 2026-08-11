// code-letter.commands.js
// Đăng ký 8 setting: font/size/tab/color cho editor và terminal.
// Không cần action riêng — agent dùng thẳng action="set" chung của settings.

const schema = require("./code-letter.schema");
const settingsCommands = require("../../../core/commands");

function syncCodeLetterOptions() {
  const base = { origin: "prime", locked: false };

  settingsCommands.registerSetting({
    id: "editor.fontFamily",
    group: "Editor",
    label: "Font chữ",
    type: "enum",
    options: schema.FONT_FAMILIES,
    default: schema.FONT_FAMILIES[0].value,
    ...base,
  });
  settingsCommands.registerSetting({
    id: "editor.fontSize",
    group: "Editor",
    label: "Cỡ chữ",
    type: "number",
    min: 10,
    max: 32,
    default: 14,
    ...base,
  });
  settingsCommands.registerSetting({
    id: "editor.tabSize",
    group: "Editor",
    label: "Độ rộng Tab",
    type: "enum",
    options: schema.TAB_SIZES,
    default: "2",
    ...base,
  });
  settingsCommands.registerSetting({
    id: "editor.colorTheme",
    group: "Editor",
    label: "Màu sắc",
    type: "enum",
    options: schema.EDITOR_THEMES,
    default: "vs-dark",
    ...base,
  });

  settingsCommands.registerSetting({
    id: "terminal.fontFamily",
    group: "Terminal",
    label: "Font chữ",
    type: "enum",
    options: schema.FONT_FAMILIES,
    default: "'Cascadia Code', 'Consolas', 'Courier New', monospace",
    ...base,
  });
  settingsCommands.registerSetting({
    id: "terminal.fontSize",
    group: "Terminal",
    label: "Cỡ chữ",
    type: "number",
    min: 10,
    max: 28,
    default: 13,
    ...base,
  });
  settingsCommands.registerSetting({
    id: "terminal.tabSize",
    group: "Terminal",
    label: "Độ rộng Tab",
    type: "enum",
    options: schema.TAB_SIZES,
    default: "4",
    ...base,
  });
  settingsCommands.registerSetting({
    id: "terminal.colorTheme",
    group: "Terminal",
    label: "Màu sắc",
    type: "enum",
    options: schema.TERMINAL_THEMES,
    default: "dark",
    ...base,
  });
}

module.exports = { syncCodeLetterOptions };
