import { LitElement, unsafeCSS } from "lit";
import { sidebarTemplate } from "./sidebar.template.js";
import {
  openFolder,
  loadLastFolder,
} from "@shared/folder-actions.js";
import styles from "./sidebar.css?inline";
import "./tree_item/tree-item.js";
import "./context_menu/context-menu.js";

class ModuleSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    folderPath: { type: String },
    folderName: { type: String },
    items: { type: Array },
    menuOpen: { state: true },
    menuX: { state: true },
    menuY: { state: true },
  };

  constructor() {
    super();
    this.folderPath = null;
    this.folderName = "";
    this.items = [];
    this.menuOpen = false;
    this.menuX = 0;
    this.menuY = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workbench:folder-opened", this.handleFolderOpened);
    this.addEventListener("ed:tree-refresh", this.handleTreeRefresh);
    this.restoreLastFolder();
  }

  disconnectedCallback() {
    window.removeEventListener(
      "workbench:folder-opened",
      this.handleFolderOpened,
    );
    this.removeEventListener("ed:tree-refresh", this.handleTreeRefresh);
    super.disconnectedCallback();
  }

  handleTreeRefresh = async (e) => {
    if (e.detail.parentPath !== this.folderPath) return;
    this.items = await window.api.fs.readDirectory(this.folderPath);
  };

  async restoreLastFolder() {
    const result = await loadLastFolder();
    if (result) this.handleFolderOpened({ detail: result });
  }

  handleFolderOpened = (e) => {
    this.folderPath = e.detail.folderPath;
    this.folderName = e.detail.folderPath.split(/[\\/]/).pop();
    this.items = e.detail.entries;
  };

  handleOpenFolder() {
    openFolder();
  }

  handleContextMenu(e) {
    e.preventDefault();
    if (!this.folderPath) return;
    this.menuX = e.clientX;
    this.menuY = e.clientY;
    this.menuOpen = true;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  async handleNewFile() {
    this.closeMenu();
    const name = window.prompt("Tên file mới:");
    if (!name) return;
    await createFile(this.folderPath, name);
    this.items = await window.api.fs.readDirectory(this.folderPath);
  }

  async handleNewFolder() {
    this.closeMenu();
    const name = window.prompt("Tên thư mục mới:");
    if (!name) return;
    await createFolder(this.folderPath, name);
    this.items = await window.api.fs.readDirectory(this.folderPath);
  }

  render() {
    return sidebarTemplate(this);
  }
}

customElements.define("module-sidebar", ModuleSidebarElement);
