import { LitElement, unsafeCSS } from "lit";
import { editorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import "../view/index/index.js";
import { getEditorView } from "../view/index/view-registry.js";
import { getSelectedAgent } from "../../ag-sidebar/group/agent/agent-selection.js";

class AgEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    mode: { state: true },
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
    const current = getSelectedAgent();
    if (current) this.handleAgentSelect({ detail: { agentId: current } });
  }

  disconnectedCallback() {
    window.removeEventListener("agents:select", this.handleAgentSelect);
    super.disconnectedCallback();
  }

  handleAgentSelect = (e) => {
    this.mode = e.detail.agentId ? "agent" : "";
    this.contextId = e.detail.agentId || "";
  };

  render() {
    return editorTemplate(getEditorView(this.mode), this.contextId);
  }
}

customElements.define("module-ag-editor-group", AgEditorGroupElement);
