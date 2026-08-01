import { LitElement, unsafeCSS } from "lit";
import { sidebarTemplate } from "./sidebar.template.js";
import { openFolder, loadLastFolder } from "../../../../src/renderer/shared/folder-actions.js";
import styles from "./sidebar.css?inline";

class ModuleSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    folderPath: { type: String },
    folderName: { type: String },
    items: { type: Array },
  };

  constructor() {
    super();
    this.folderPath = null;
    this.folderName = "";
    this.items = [];
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workbench:folder-opened", this.handleFolderOpened);
    this.restoreLastFolder();
  }

  disconnectedCallback() {
    window.removeEventListener(
      "workbench:folder-opened",
      this.handleFolderOpened,
    );
    super.disconnectedCallback();
  }

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

  render() {
    return sidebarTemplate(this);
  }
}

customElements.define("module-sidebar", ModuleSidebarElement);
