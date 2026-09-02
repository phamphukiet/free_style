// remap-state.js
// State tạm giữ dữ liệu remap, sống độc lập vòng đời custom element
// (giống agent-selection.js) vì ag-editor-group unmount/remount khi đổi mode.

let pending = null; // { presetId, oldRoles, newRoles, instancesByOldRole }

export function setRemapPending(data) {
  pending = data;
  window.dispatchEvent(
    new CustomEvent("org:preset-remap-pending", { detail: data }),
  );
}

export function getRemapPending() {
  return pending;
}

export function clearRemapPending() {
  pending = null;
}
