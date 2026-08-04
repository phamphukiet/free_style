// editor-group.js
import { LitElement } from "lit";
import { editorGroupTemplate } from "./editor-group.template.js";
import { registry } from "@modules/registry.js";

class EditorGroupElement extends LitElement {
  static properties = {
    openFiles: { state: true },
    activePath: { state: true },
  };

  constructor() {
    super();
    this.openFiles = [];
    this.activePath = "";
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workbench:open-file", this.handleOpenFile);
  }

  disconnectedCallback() {
    window.removeEventListener("workbench:open-file", this.handleOpenFile);
    super.disconnectedCallback();
  }

  handleOpenFile = (e) => {
    const { filePath, fileName } = e.detail;
    const exists = this.openFiles.some((f) => f.path === filePath);
    if (!exists) {
      this.openFiles = [...this.openFiles, { path: filePath, name: fileName }];
    }
    this.activePath = filePath;
  };

  handleSelectTab(path) {
    this.activePath = path;
  }

  handleCloseFile(path) {
    const closingIndex = this.openFiles.findIndex((f) => f.path === path);
    this.openFiles = this.openFiles.filter((f) => f.path !== path);
    window.dispatchEvent(
      new CustomEvent("workbench:close-file", { detail: { filePath: path } }),
    );

    if (this.activePath !== path) return;
    this.activePath =
      this.openFiles.length === 0
        ? ""
        : this.openFiles[Math.min(closingIndex, this.openFiles.length - 1)]
            .path;
  }

  render() {
    const emptyTagName = registry.getEmptyEditorView();
    return editorGroupTemplate(this, emptyTagName);
  }
}

customElements.define("workbench-editor-group", EditorGroupElement);
