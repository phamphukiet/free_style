const { SAVE_MODES } = require("./save.schema");
const settingsCommands = require("../../../core/commands");

function syncSaveOptions() {
  const base = { origin: "prime", locked: false, group: "Editor" };
  settingsCommands.registerSetting({
    id: "editor.saveMode",
    label: "Chế độ lưu file",
    type: "enum",
    options: SAVE_MODES,
    default: "off",
    ...base,
  });
  settingsCommands.registerSetting({
    id: "editor.saveIntervalSec",
    label: "Số giây tự lưu",
    type: "number",
    min: 1,
    max: 300,
    default: 10,
    ...base,
  });
}

module.exports = { syncSaveOptions, actions: {}, getHint: () => "" };
