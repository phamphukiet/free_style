import { LitElement, unsafeCSS } from "lit";
import { sidebarTemplate } from "./sidebar.template.js";
import { openFolder, loadLastFolder } from "@shared/folder-actions.js";
import {
  createFile,
  createFolder,
  getParentPath,
  copyPath,
  movePath,
} from "@shared/fs-actions.js";
import { getClipboard, clearClipboard } from "@shared/clipboard.js";
import styles from "./sidebar.css?inline";
import "./tree_item/tree-item.js";
import "./context_menu/context-menu.js";

const normalize = (p) => (p ? p.replace(/\\/g, "/").toLowerCase() : "");

class ModuleSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    folderPath: { type: String },
    folderName: { type: String },
    items: { type: Array },
    menuOpen: { state: true },
    menuX: { state: true },
    menuY: { state: true },
    menuItems: { state: true },
    creatingType: { state: true },
    selectedPath: { state: true },
    selectedIsDirectory: { state: true },
  };

  constructor() {
    super();
    this.folderPath = null;
    this.folderName = "";
    this.items = [];
    this.menuOpen = false;
    this.menuX = 0;
    this.menuY = 0;
    this.menuItems = [];
    this.creatingType = null;
    this.selectedPath = "";
    this.selectedIsDirectory = false;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workbench:folder-opened", this.handleFolderOpened);
    this.addEventListener("ed:tree-refresh", this.handleTreeRefresh);
    this.addEventListener("ed:contextmenu", this.handleTreeContextMenu);
    this.addEventListener("ed:select", (e) => {
      this.selectedPath = e.detail.path;
      this.selectedIsDirectory = e.detail.isDirectory;
    });
    this.restoreLastFolder();
  }

  disconnectedCallback() {
    window.removeEventListener(
      "workbench:folder-opened",
      this.handleFolderOpened,
    );
    this.removeEventListener("ed:tree-refresh", this.handleTreeRefresh);
    this.removeEventListener("ed:contextmenu", this.handleTreeContextMenu);
    super.disconnectedCallback();
  }

  handleTreeRefresh = async (e) => {
    if (normalize(e.detail.parentPath) === normalize(this.folderPath)) {
      this.items = await window.api.fs.readDirectory(this.folderPath);
    }
  };

  handleFolderOpened = (e) => {
    this.folderPath = e.detail.folderPath;
    this.folderName = e.detail.folderPath.split(/[\\/]/).pop();
    this.items = e.detail.entries;
  };

  async restoreLastFolder() {
    const result = await loadLastFolder();
    if (result) this.handleFolderOpened({ detail: result });
  }

  handleOpenFolder() {
    openFolder();
  }

  handleTreeContextMenu = (e) => {
    this.menuX = e.detail.x;
    this.menuY = e.detail.y;
    this.menuItems = e.detail.items;
    this.menuOpen = true;
  };

  handleContextMenu(e) {
    e.preventDefault();
    if (!this.folderPath) return;
    this.menuX = e.clientX;
    this.menuY = e.clientY;
    this.menuItems = [
      { label: "New File", onClick: () => this.handleNewFile() },
      { label: "New Folder", onClick: () => this.handleNewFolder() },
    ];
    if (getClipboard()) {
      this.menuItems.push({ type: "separator" });
      this.menuItems.push({
        label: "Paste",
        onClick: () => this.handlePasteToRoot(),
      });
    }
    this.menuOpen = true;
  }

  closeMenu() {
    this.menuOpen = false;
  }
  async handleNewFile() {
    this.startCreate("file");
  }
  async handleNewFolder() {
    this.startCreate("folder");
  }

  async startCreate(type) {
    this.closeMenu();
    if (this.selectedPath) {
      const target = this.selectedIsDirectory
        ? this.selectedPath
        : getParentPath(this.selectedPath);
      if (normalize(target) !== normalize(this.folderPath)) {
        window.dispatchEvent(
          new CustomEvent("ed:start-create", {
            detail: { targetPath: target, type },
          }),
        );
        return;
      }
    }
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
      if (type === "file") await createFile(this.folderPath, name);
      else await createFolder(this.folderPath, name);
      this.items = await window.api.fs.readDirectory(this.folderPath);
    }
  };

  async handleReload() {
    this.items = await window.api.fs.readDirectory(this.folderPath);
    this.shadowRoot.querySelectorAll("ed-tree-item").forEach((el) => {
      if (el.expanded) el.loadChildren();
    });
  }

  handleCollapseAll() {
    this.shadowRoot.querySelectorAll("ed-tree-item").forEach((el) => {
      el.expanded = false;
      el.children = null;
    });
  }

  async handleRootDrop(e) {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    await movePath(data.path, this.folderPath, data.isDirectory);
    this.items = await window.api.fs.readDirectory(this.folderPath);
  }

  handleRootDragOver(e) {
    e.preventDefault();
  }

  async handlePasteToRoot() {
    const clip = getClipboard();
    if (!clip) return;
    if (clip.mode === "copy")
      await copyPath(clip.path, this.folderPath, clip.isDirectory);
    else {
      await movePath(clip.path, this.folderPath, clip.isDirectory);
      clearClipboard();
    }
    this.items = await window.api.fs.readDirectory(this.folderPath);
  }

  render() {
    return sidebarTemplate(this);
  }
}

customElements.define("module-sidebar", ModuleSidebarElement);
