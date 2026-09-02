import { setRemapPending } from "./partial/remap/remap-state.js";
import { makeOrgRoleHandlers } from "./partial/org-role-handlers.js";

export function makeOrgHandlers(host) {
  return {
    async loadOrg() {
      host.org = await window.api.org.get();
    },
    async loadPresets() {
      host.presets = await window.api.org.listPresets();
    },
    toggleOrgSection() {
      host.orgCollapsed = !host.orgCollapsed;
    },

    async handleSelectPreset(presetId) {
      const diff = await window.api.org.previewPresetChange(presetId);
      const hasInstances = Object.keys(diff.instancesByOldRole).length > 0;
      if (!hasInstances) {
        host.org = await window.api.org.selectPreset(presetId);
        return;
      }
      setRemapPending({ presetId, ...diff });
    },

    startSavePreset() {
      host.orgSavingPreset = true;
    },
    async handleSavePresetConfirm(e) {
      const name = e.target.value.trim();
      host.orgSavingPreset = false;
      await window.api.org.saveAsPreset(name);
      host.presets = await window.api.org.listPresets();
      host.lastUsedPresetId = await window.api.org.getLastUsedPreset();
    },

    ...makeOrgRoleHandlers(host),
  };
}
