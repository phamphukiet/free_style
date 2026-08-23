import { LitElement } from "lit";
import { paneTemplate } from "./pane.template.js";
import { registry } from "@modules/registry.js";

class EditorPaneElement extends LitElement {
  static properties = {
    paneId: { type: String },
    isActive: { type: Boolean },
    showDivider: { type: Boolean },
    openFiles: { state: true },
    activePath: { state: true },
    activeModuleId: { state: true },
  };

  constructor() {
    super();
    this.openFiles = [];
    this.activePath = "";
    this.activeModuleId = "explorer";
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workbench:open-file", this.handleOpenFile);
    window.addEventListener("workbench:sidebar-tab", this.handleSidebarTab);
  }

  disconnectedCallback() {
    window.removeEventListener("workbench:open-file", this.handleOpenFile);
    window.removeEventListener("workbench:sidebar-tab", this.handleSidebarTab);
    super.disconnectedCallback();
  }

  // Chỉ pane đang active mới nhận đổi sidebar-tab / file mới mở không chỉ định paneId.
  handleSidebarTab = (e) => {
    if (this.isActive) this.activeModuleId = e.detail.tabId;
  };

  handleOpenFile = (e) => {
    const target = e.detail.paneId;
    if (target ? target !== this.paneId : !this.isActive) return;
    const { filePath, fileName } = e.detail;
    if (!this.openFiles.some((f) => f.path === filePath))
      this.openFiles = [...this.openFiles, { path: filePath, name: fileName }];
    this.activePath = filePath;
  };

  handleFocus() {
    this.dispatchEvent(
      new CustomEvent("workbench:pane-focus", {
        detail: { paneId: this.paneId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleSelectTab(path) {
    this.activePath = path;
  }

  handleCloseFile(path) {
    const idx = this.openFiles.findIndex((f) => f.path === path);
    this.openFiles = this.openFiles.filter((f) => f.path !== path);
    window.dispatchEvent(
      new CustomEvent("workbench:close-file", { detail: { filePath: path } }),
    );
    if (this.activePath !== path) return;
    this.activePath =
      this.openFiles.length === 0
        ? ""
        : this.openFiles[Math.min(idx, this.openFiles.length - 1)].path;
  }

  handleSplit() {
    this.dispatchEvent(
      new CustomEvent("workbench:pane-split", {
        detail: { paneId: this.paneId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleClose() {
    this.dispatchEvent(
      new CustomEvent("workbench:pane-close", {
        detail: { paneId: this.paneId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const emptyTagName = registry.getEmptyEditorView(this.activeModuleId);
    return paneTemplate(this, emptyTagName);
  }
}

customElements.define("workbench-editor-pane", EditorPaneElement);
