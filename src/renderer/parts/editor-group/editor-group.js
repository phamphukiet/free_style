import { LitElement } from "lit";
import { editorGroupTemplate } from "./editor-group.template.js";
import "./pane/pane.js";

let paneSeq = 0;

class EditorGroupElement extends LitElement {
  static properties = { panes: { state: true }, activePaneId: { state: true } };

  constructor() {
    super();
    const firstId = `pane-${++paneSeq}`;
    this.panes = [{ id: firstId }];
    this.activePaneId = firstId;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("workbench:pane-focus", this.handlePaneFocus);
    this.addEventListener("workbench:pane-split", this.handleSplit);
    this.addEventListener("workbench:pane-close", this.handleClosePane);
  }

  disconnectedCallback() {
    this.removeEventListener("workbench:pane-focus", this.handlePaneFocus);
    this.removeEventListener("workbench:pane-split", this.handleSplit);
    this.removeEventListener("workbench:pane-close", this.handleClosePane);
    super.disconnectedCallback();
  }

  handlePaneFocus = (e) => {
    this.activePaneId = e.detail.paneId;
  };

  handleSplit = (e) => {
    const newId = `pane-${++paneSeq}`;
    const idx = this.panes.findIndex((p) => p.id === e.detail.paneId);
    const next = [...this.panes];
    next.splice(idx + 1, 0, { id: newId });
    this.panes = next;
    this.activePaneId = newId;
  };

  handleClosePane = (e) => {
    if (this.panes.length <= 1) return; // luôn giữ tối thiểu 1 pane
    this.panes = this.panes.filter((p) => p.id !== e.detail.paneId);
    if (this.activePaneId === e.detail.paneId)
      this.activePaneId = this.panes[0].id;
  };

  render() {
    return editorGroupTemplate(this);
  }
}

customElements.define("workbench-editor-group", EditorGroupElement);
