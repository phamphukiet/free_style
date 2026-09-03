import { LitElement, unsafeCSS } from "lit";
import { editorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import "../view/index/index.js";
import { getEditorView } from "../view/index/view-registry.js";
import { getSelectedAgent } from "../../ag-sidebar/group/agent/agent-selection.js";

class AgEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    mode: { state: true }, // "agent" | "org-roles" | "activate-preview" | ""
    contextId: { state: true },
  };

  constructor() {
    super();
    this.mode = "";
    this.contextId = "";
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("agents:select", this.handleAgentSelect);
    window.addEventListener("org:select-org", this.handleOrgSelect);
    window.addEventListener("org:activate-preview", this.handleActivatePreview);
    const current = getSelectedAgent();
    if (current) this.handleAgentSelect({ detail: { agentId: current } });
  }

  disconnectedCallback() {
    window.removeEventListener("agents:select", this.handleAgentSelect);
    window.removeEventListener("org:select-org", this.handleOrgSelect);
    window.removeEventListener(
      "org:activate-preview",
      this.handleActivatePreview,
    );
    super.disconnectedCallback();
  }

  handleAgentSelect = (e) => {
    this.mode = e.detail.agentId ? "agent" : "";
    this.contextId = e.detail.agentId || "";
  };

  handleOrgSelect = (e) => {
    this.mode = e.detail.orgId ? "org-roles" : "";
    this.contextId = e.detail.orgId || "";
  };

  handleActivatePreview = (e) => {
    this.mode = e.detail.orgId ? "activate-preview" : "";
    this.contextId = e.detail.orgId || "";
  };

  render() {
    return editorTemplate(getEditorView(this.mode), this.contextId);
  }
}

customElements.define("module-ag-editor-group", AgEditorGroupElement);
