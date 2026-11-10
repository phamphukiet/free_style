import { LitElement, unsafeCSS } from "lit";
import { stSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";
import { listPages, onPagesChanged } from "../pages.js";

class StSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    groups: { state: true },
    activeGroup: { state: true },
    pages: { state: true },
  };
  constructor() {
    super();
    this.groups = [];
    this.activeGroup = "";
    this.pages = listPages();
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadGroups();
    window.addEventListener("workbench:settings-changed", this.loadGroups);
    window.addEventListener("settings:select-group", this.syncActive);
    this._offPages = onPagesChanged((pages) => (this.pages = pages));    // Ext thêm/đổi setting → nhóm mới (VD "Extension") phải hiện ngay.
    this._offSettings = window.api.settings.onChanged(this.loadGroups);
  }

  disconnectedCallback() {
    window.removeEventListener("workbench:settings-changed", this.loadGroups);
    window.removeEventListener("settings:select-group", this.syncActive);
    this._offPages();
    this._offSettings();
    super.disconnectedCallback();
  }

  syncActive = (e) => {
    this.activeGroup = e.detail.group;
  };

  loadGroups = async () => {
    this.groups = await window.api.settings.listGroups();
    if (!this.activeGroup && this.groups.length > 0)
      this.handleSelect(this.groups[0]);
  };

  handleSelect(group) {
    window.dispatchEvent(
      new CustomEvent("settings:select-group", { detail: { group } }),
    );
  }

  render() {
    return stSidebarTemplate(this);
  }
}

customElements.define("module-st-sidebar", StSidebarElement);
