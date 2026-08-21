// agent-selection.js
// State dùng chung sidebar <-> editor, sống độc lập vòng đời custom element.
// Vì editor-group unmount/remount ag-editor-group mỗi khi đổi tab activitybar,
// component-level state (this.agentId...) sẽ mất — biến module-level thì không.

let selectedAgentId = "";

export function setSelectedAgent(id) {
  selectedAgentId = id;
  window.dispatchEvent(
    new CustomEvent("agents:select", { detail: { agentId: id } }),
  );
}

export function getSelectedAgent() {
  return selectedAgentId;
}
