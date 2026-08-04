// sidebar.js
import { LitElement, unsafeCSS } from "lit";
import { sidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";
import { registry } from "@modules/registry.js";

class SidebarElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    activeTab: { type: String },
  };

  constructor() {
    super();
    this.activeTab = "explorer"; // Default
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workbench:sidebar-tab", this.handleTabChange);
  }

  disconnectedCallback() {
    window.removeEventListener("workbench:sidebar-tab", this.handleTabChange);
    super.disconnectedCallback();
  }

  handleTabChange = (e) => {
    this.activeTab = e.detail.tabId;
  };

  render() {
    // Get view from registry
    const tagName = registry.getSidebarView(this.activeTab);
    return sidebarTemplate(this, tagName);
  }
}

customElements.define("workbench-sidebar", SidebarElement);
