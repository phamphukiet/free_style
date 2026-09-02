import { LitElement, unsafeCSS } from "lit";
import { editorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import "./view/index.js";
import { getEditorView } from "./view/view-registry.js";
import { getSelectedAgent } from "../ag-sidebar/group/agent/agent-selection.js";

class AgEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    mode: { state: true }, // "agent" | "org" | ""
    contextId: { state: true }, // agentId hoặc roleId tuỳ mode
  };

  constructor() {
    super();
    this.mode = "";
    this.contextId = "";
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("agents:select", this.handleAgentSelect);
    window.addEventListener("org:select-role", this.handleRoleSelect);
    window.addEventListener(
      "org:preset-remap-pending",
      this.handleRemapPending,
    );
    const current = getSelectedAgent();
    if (current) this.handleAgentSelect({ detail: { agentId: current } });
  }

  disconnectedCallback() {
    window.removeEventListener("agents:select", this.handleAgentSelect);
    window.removeEventListener("org:select-role", this.handleRoleSelect);
    window.removeEventListener(
      "org:preset-remap-pending",
      this.handleRemapPending,
    );
    super.disconnectedCallback();
  }

  handleAgentSelect = (e) => {
    this.mode = e.detail.agentId ? "agent" : "";
    this.contextId = e.detail.agentId || "";
  };

  handleRoleSelect = (e) => {
    this.mode = e.detail.roleId ? "org" : "";
    this.contextId = e.detail.roleId || "";
  };

  handleRemapPending = (e) => {
    this.mode = "remap";
    this.contextId = e.detail.presetId;
  };

  render() {
    return editorTemplate(getEditorView(this.mode), this.contextId);
  }
}

customElements.define("module-ag-editor-group", AgEditorGroupElement);
