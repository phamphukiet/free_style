import { LitElement } from "lit";
import { editorGroupTemplate } from "./editor-group.template.js";
import "@modules/editor/frontend/ed-editor-group/editor.js";

class EditorGroupElement extends LitElement {
  static properties = {
    hasFile: { type: Boolean },
    activeFilePath: { state: true },
    activeFileName: { state: true },
  };

  constructor() {
    super();
    this.hasFile = false;
    this.activeFilePath = "";
    this.activeFileName = "";
  }

  createRenderRoot() { return this; }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workbench:open-file", this.handleOpenFile);
  }

  disconnectedCallback() {
    window.removeEventListener("workbench:open-file", this.handleOpenFile);
    super.disconnectedCallback();
  }

  handleOpenFile = (e) => {
    this.activeFilePath = e.detail.filePath;
    this.activeFileName = e.detail.fileName;
    this.hasFile = true;
  };

  handleCloseFile() {
    this.hasFile = false;
    this.activeFilePath = "";
    this.activeFileName = "";
  }

  render() {
    return editorGroupTemplate(this);
  }
}

customElements.define("workbench-editor-group", EditorGroupElement);
