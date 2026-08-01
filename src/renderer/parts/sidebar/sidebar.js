import { LitElement, unsafeCSS } from "lit";
import { sidebarTemplate } from "./sidebar.template.js";
import { openFolder } from "../../shared/folder-actions.js";
import styles from "./sidebar.css?inline";

class SidebarElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    folderPath: { type: String },
    folderName: { type: String },
    items: { type: Array },
  };

  constructor() {
    super();
    // Chưa mở folder nào -> sidebar hiện nút Open Folder (xem template).
    this.folderPath = null;
    this.folderName = "";
    this.items = [];
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workbench:folder-opened", this.handleFolderOpened);
  }

  disconnectedCallback() {
    window.removeEventListener(
      "workbench:folder-opened",
      this.handleFolderOpened,
    );
    super.disconnectedCallback();
  }

  handleFolderOpened = (e) => {
    this.folderPath = e.detail.folderPath;
    this.folderName = e.detail.folderPath.split(/[\\/]/).pop();
    this.items = e.detail.entries;
  };

  handleOpenFolder() {
    openFolder();
  }

  render() {
    return sidebarTemplate(this);
  }
}

customElements.define("workbench-sidebar", SidebarElement);
