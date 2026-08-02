import { LitElement, unsafeCSS } from "lit";
import { treeItemTemplate } from "./tree-item.template.js";
import styles from "./tree-item.css?inline";
import {
  createFile,
  createFolder,
  renamePath,
  deletePath,
  getParentPath,
  movePath,
  copyPath,
} from "@shared/fs-actions.js";

import {
  setClipboard,
  getClipboard,
  clearClipboard,
} from "@shared/clipboard.js";

const normalize = (p) => (p ? p.replace(/\\/g, "/").toLowerCase() : "");

class TreeItemElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    name: { type: String },
    path: { type: String },
    isDirectory: { type: Boolean },
    depth: { type: Number },
    expanded: { state: true },
    children: { state: true },
    renaming: { state: true },
    creatingType: { state: true },
    selectedPath: { type: String },
    dragOver: { state: true },
    isCut: { state: true },
  };

  constructor() {
    super();
    this.depth = 0;
    this.expanded = false;
    this.children = null;
    this.renaming = false;
    this.creatingType = null;
    this.selectedPath = "";
    this.dragOver = false;
    this.isCut = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("ed:tree-refresh", this.handleTreeRefresh);
    window.addEventListener("ed:start-create", this.handleExternalStartCreate);
    window.addEventListener(
      "ed:clipboard-changed",
      this.handleClipboardChanged,
    );
  }

  disconnectedCallback() {
    this.removeEventListener("ed:tree-refresh", this.handleTreeRefresh);
    window.removeEventListener(
      "ed:start-create",
      this.handleExternalStartCreate,
    );
    window.removeEventListener(
      "ed:clipboard-changed",
      this.handleClipboardChanged,
    );
    super.disconnectedCallback();
  }

  handleTreeRefresh = (e) => {
    if (normalize(e.detail.parentPath) === normalize(this.path))
      this.loadChildren();
  };

  handleExternalStartCreate = (e) => {
    if (e.detail.targetPath === this.path) this.startCreate(e.detail.type);
  };

  async loadChildren() {
    this.children = await window.api.fs.readDirectory(this.path);
  }

  async handleToggle() {
    this.dispatchEvent(
      new CustomEvent("ed:select", {
        bubbles: true,
        composed: true,
        detail: { path: this.path, isDirectory: this.isDirectory },
      }),
    );
    if (!this.isDirectory) {
      window.dispatchEvent(
        new CustomEvent("workbench:open-file", {
          detail: { filePath: this.path, fileName: this.name },
        }),
      );
      return;
    }
    this.expanded = !this.expanded;
    if (this.expanded && this.children === null) await this.loadChildren();
  }

  handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("ed:select", {
        bubbles: true,
        composed: true,
        detail: { path: this.path, isDirectory: this.isDirectory },
      }),
    );
    const items = [];
    if (this.isDirectory) {
      items.push({ label: "New File", onClick: () => this.handleNewFile() });
      items.push({
        label: "New Folder",
        onClick: () => this.handleNewFolder(),
      });
      items.push({ type: "separator" });
    }
    items.push({ label: "Copy", onClick: () => this.handleCopy() });
    items.push({ label: "Cut", onClick: () => this.handleCut() });
    if (this.isDirectory && getClipboard()) {
      items.push({ label: "Paste", onClick: () => this.handlePaste() });
    }
    items.push({ type: "separator" });
    items.push({ label: "Rename", onClick: () => this.handleRenameStart() });
    items.push({ label: "Delete", onClick: () => this.handleDelete() });
    this.dispatchEvent(
      new CustomEvent("ed:contextmenu", {
        bubbles: true,
        composed: true,
        detail: { x: e.clientX, y: e.clientY, items },
      }),
    );
  }

  notifyParentRefresh() {
    this.dispatchEvent(
      new CustomEvent("ed:tree-refresh", {
        detail: { parentPath: getParentPath(this.path) },
        bubbles: true,
        composed: true,
      }),
    );
  }

  async handleRenameStart() {
    this.renaming = true;
    await this.updateComplete;
    const input = this.shadowRoot.querySelector(".rename-input");
    input?.focus();
    input?.select();
  }

  handleRenameConfirm = async (e) => {
    if (!this.renaming) return;
    const newName = e.target.value.trim();
    this.renaming = false;
    if (newName && newName !== this.name) {
      await renamePath(this.path, newName, this.isDirectory);
      this.notifyParentRefresh();
    }
  };

  handleRenameCancel = (e) => {
    e.target.value = this.name;
    this.renaming = false;
  };
  async handleNewFile() {
    this.startCreate("file");
  }
  async handleNewFolder() {
    this.startCreate("folder");
  }

  async startCreate(type) {
    this.expanded = true;
    if (this.children === null) await this.loadChildren();
    this.creatingType = type;
    await this.updateComplete;
    this.shadowRoot.querySelector(".create-input")?.focus();
  }

  handleCreateConfirm = async (e) => {
    if (!this.creatingType) return;
    const name = e.target.value.trim();
    const type = this.creatingType;
    this.creatingType = null;
    if (name) {
      if (type === "file") await createFile(this.path, name);
      else await createFolder(this.path, name);
      await this.loadChildren();
    }
  };

  async handleDelete() {
    if (window.confirm(`Xoá "${this.name}"?`)) {
      await deletePath(this.path);
      this.notifyParentRefresh();
    }
  }

  handleDragStart(e) {
    e.stopPropagation();
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        path: this.path,
        isDirectory: this.isDirectory,
        name: this.name,
      }),
    );
    e.dataTransfer.effectAllowed = "move";
  }

  handleDragOver(e) {
    if (!this.isDirectory) return;
    e.preventDefault();
    e.stopPropagation();
    this.dragOver = true;
  }
  handleClipboardChanged = (e) => {
    this.isCut = e.detail?.mode === "cut" && e.detail.path === this.path;
  };

  handleCopy() {
    setClipboard(this.path, this.isDirectory, "copy");
  }
  handleCut() {
    setClipboard(this.path, this.isDirectory, "cut");
  }

  async handlePaste() {
    const clip = getClipboard();
    if (!clip) return;
    if (clip.mode === "copy")
      await copyPath(clip.path, this.path, clip.isDirectory);
    else {
      await movePath(clip.path, this.path, clip.isDirectory);
      clearClipboard();
    }
    await this.loadChildren();
    this.dispatchEvent(
      new CustomEvent("ed:tree-refresh", {
        detail: { parentPath: getParentPath(clip.path) },
        bubbles: true,
        composed: true,
      }),
    );
  }
  handleDragLeave() {
    this.dragOver = false;
  }

  async handleDrop(e) {
    if (!this.isDirectory) return;
    e.preventDefault();
    e.stopPropagation();
    this.dragOver = false;
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    await movePath(data.path, this.path, data.isDirectory);
    this.dispatchEvent(
      new CustomEvent("ed:tree-refresh", {
        detail: { parentPath: this.path },
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("ed:tree-refresh", {
        detail: { parentPath: getParentPath(data.path) },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return treeItemTemplate(this);
  }
}

customElements.define("ed-tree-item", TreeItemElement);
