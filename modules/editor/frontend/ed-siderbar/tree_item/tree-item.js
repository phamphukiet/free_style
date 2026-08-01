import { LitElement, unsafeCSS } from "lit";
import { treeItemTemplate } from "./tree-item.template.js";
import styles from "./tree-item.css?inline";
import "../context_menu/context-menu.js";
import {
  createFile,
  createFolder,
  renamePath,
  deletePath,
  getParentPath,
} from "@shared/fs-actions.js";

class TreeItemElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    name: { type: String },
    path: { type: String },
    isDirectory: { type: Boolean },
    depth: { type: Number },
    expanded: { state: true },
    children: { state: true },
    menuOpen: { state: true },
    menuX: { state: true },
    menuY: { state: true },
  };

  constructor() {
    super();
    this.depth = 0;
    this.expanded = false;
    this.children = null; // null = chưa từng load
    this.menuOpen = false;
    this.menuX = 0;
    this.menuY = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("ed:tree-refresh", this.handleTreeRefresh);
  }

  disconnectedCallback() {
    this.removeEventListener("ed:tree-refresh", this.handleTreeRefresh);
    super.disconnectedCallback();
  }

  handleTreeRefresh = (e) => {
    if (e.detail.parentPath !== this.path) return;
    this.loadChildren();
  };

  async loadChildren() {
    this.children = await window.api.fs.readDirectory(this.path);
  }

  async handleToggle() {
    if (!this.isDirectory) return;
    this.expanded = !this.expanded;
    if (this.expanded && this.children === null) {
      await this.loadChildren();
    }
  }

  handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    this.menuX = e.clientX;
    this.menuY = e.clientY;
    this.menuOpen = true;
  }

  closeMenu() {
    this.menuOpen = false;
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

  async handleNewFile() {
    this.closeMenu();
    const name = window.prompt("Tên file mới:");
    if (!name) return;
    await createFile(this.path, name);
    this.expanded = true;
    await this.loadChildren();
  }

  async handleNewFolder() {
    this.closeMenu();
    const name = window.prompt("Tên thư mục mới:");
    if (!name) return;
    await createFolder(this.path, name);
    this.expanded = true;
    await this.loadChildren();
  }

  async handleRename() {
    this.closeMenu();
    const newName = window.prompt("Đổi tên thành:", this.name);
    if (!newName || newName === this.name) return;
    await renamePath(this.path, newName);
    this.notifyParentRefresh();
  }

  async handleDelete() {
    this.closeMenu();
    const ok = window.confirm(`Xoá "${this.name}"?`);
    if (!ok) return;
    await deletePath(this.path);
    this.notifyParentRefresh();
  }
  
  async handleToggle() {
    if (!this.isDirectory) return;
    this.expanded = !this.expanded;
    if (this.expanded && this.children === null) {
      this.children = await window.api.fs.readDirectory(this.path);
    }
  }

  render() {
    return treeItemTemplate(this);
  }
}

customElements.define("ed-tree-item", TreeItemElement);
