import { LitElement, unsafeCSS } from "lit";
import { treeItemTemplate } from "./tree-item.template.js";
import styles from "./tree-item.css?inline";
import {
  createFile, createFolder, renamePath, deletePath, getParentPath,
} from "@shared/fs-actions.js";

const normalize = (p) => (p ? p.replace(/\\/g, "/").toLowerCase() : "");

class TreeItemElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    name: { type: String }, path: { type: String },
    isDirectory: { type: Boolean }, depth: { type: Number },
    expanded: { state: true }, children: { state: true },
    renaming: { state: true }, creatingType: { state: true },
    selectedPath: { type: String },
  };

  constructor() {
    super();
    this.depth = 0; this.expanded = false; this.children = null;
    this.renaming = false; this.creatingType = null; this.selectedPath = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("ed:tree-refresh", this.handleTreeRefresh);
    window.addEventListener("ed:start-create", this.handleExternalStartCreate);
  }

  disconnectedCallback() {
    this.removeEventListener("ed:tree-refresh", this.handleTreeRefresh);
    window.removeEventListener("ed:start-create", this.handleExternalStartCreate);
    super.disconnectedCallback();
  }

  handleTreeRefresh = (e) => {
    if (normalize(e.detail.parentPath) === normalize(this.path)) this.loadChildren();
  };

  handleExternalStartCreate = (e) => {
    if (e.detail.targetPath === this.path) this.startCreate(e.detail.type);
  };

  async loadChildren() { this.children = await window.api.fs.readDirectory(this.path); }

  async handleToggle() {
    this.dispatchEvent(new CustomEvent("ed:select", {
      bubbles: true, composed: true, detail: { path: this.path, isDirectory: this.isDirectory }
    }));
    if (!this.isDirectory) {
      window.dispatchEvent(new CustomEvent("workbench:open-file", {
        detail: { filePath: this.path, fileName: this.name }
      }));
      return;
    }
    this.expanded = !this.expanded;
    if (this.expanded && this.children === null) await this.loadChildren();
  }

  handleContextMenu(e) {
    e.preventDefault(); e.stopPropagation();
    this.dispatchEvent(new CustomEvent("ed:select", {
      bubbles: true, composed: true, detail: { path: this.path, isDirectory: this.isDirectory }
    }));
    const items = [];
    if (this.isDirectory) {
      items.push({ label: "New File", onClick: () => this.handleNewFile() });
      items.push({ label: "New Folder", onClick: () => this.handleNewFolder() });
      items.push({ type: "separator" });
    }
    items.push({ label: "Rename", onClick: () => this.handleRenameStart() });
    items.push({ label: "Delete", onClick: () => this.handleDelete() });
    this.dispatchEvent(new CustomEvent("ed:contextmenu", {
      bubbles: true, composed: true, detail: { x: e.clientX, y: e.clientY, items },
    }));
  }

  notifyParentRefresh() {
    this.dispatchEvent(new CustomEvent("ed:tree-refresh", {
      detail: { parentPath: getParentPath(this.path) }, bubbles: true, composed: true,
    }));
  }

  async handleRenameStart() {
    this.renaming = true; await this.updateComplete;
    const input = this.shadowRoot.querySelector(".rename-input");
    input?.focus(); input?.select();
  }

  handleRenameConfirm = async (e) => {
    if (!this.renaming) return;
    const newName = e.target.value.trim(); this.renaming = false;
    if (newName && newName !== this.name) {
      await renamePath(this.path, newName, this.isDirectory); this.notifyParentRefresh();
    }
  };

  handleRenameCancel = (e) => { e.target.value = this.name; this.renaming = false; };
  async handleNewFile() { this.startCreate("file"); }
  async handleNewFolder() { this.startCreate("folder"); }

  async startCreate(type) {
    this.expanded = true;
    if (this.children === null) await this.loadChildren();
    this.creatingType = type; await this.updateComplete;
    this.shadowRoot.querySelector(".create-input")?.focus();
  }

  handleCreateConfirm = async (e) => {
    if (!this.creatingType) return;
    const name = e.target.value.trim(); const type = this.creatingType;
    this.creatingType = null;
    if (name) {
      if (type === "file") await createFile(this.path, name);
      else await createFolder(this.path, name);
      await this.loadChildren();
    }
  };

  async handleDelete() {
    if (window.confirm(`Xoá "${this.name}"?`)) {
      await deletePath(this.path); this.notifyParentRefresh();
    }
  }

  render() { return treeItemTemplate(this); }
}

customElements.define("ed-tree-item", TreeItemElement);
