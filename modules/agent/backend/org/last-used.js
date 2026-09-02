const { readState, writeState } = require("../../../../src/main/state");

function getLastUsedPreset() {
  return readState().lastUsedPresetId || null;
}
function setLastUsedPreset(presetId) {
  if (getLastUsedPreset() === presetId) return;
  writeState({ lastUsedPresetId: presetId });
}
module.exports = { getLastUsedPreset, setLastUsedPreset };
