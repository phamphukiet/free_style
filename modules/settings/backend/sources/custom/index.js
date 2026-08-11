const store = require("./custom.store");
const settingsCommands = require("../../core/commands");
const { actions, getHint } = require("./custom.actions");

function init() {
  const saved = store.readDefinitions();
  Object.values(saved).forEach((def) =>
    settingsCommands.registerSetting({
      ...def,
      origin: "custom",
      locked: false,
    }),
  );
}
function getExtraActions() {
  return actions;
}
function getExtraHints() {
  return getHint();
}

module.exports = { init, getExtraActions, getExtraHints };
