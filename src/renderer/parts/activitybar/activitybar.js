// activitybar.js
import { LitElement, unsafeCSS } from "lit";
import { activitybarTemplate } from "./activitybar.template.js";
import styles from "./activitybar.css?inline";
import { registry } from "@modules/registry.js";

class ActivitybarElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    activeId: { type: String },
    items: { type: Array },
  };

  constructor() {
    super();
    this.activeId = "explorer"; // Default active tab
    this.items = registry.getActivitybarItems();
  }

  connectedCallback() {
    super.connectedCallback();
    registry.on("activitybar:changed", (newItems) => {
      this.items = [...newItems];
      // Tự động set activeId nếu đang rỗng và có item mới
      if (!this.activeId && this.items.length > 0) {
        this.activeId = this.items[0].id;
        this.notifySidebar();
      }
    });
  }

  handleIconClick(id) {
    this.activeId = id;
    this.notifySidebar();
  }

  notifySidebar() {
    window.dispatchEvent(
      new CustomEvent("workbench:sidebar-tab", { detail: { tabId: this.activeId } })
    );
  }

  render() {
    return activitybarTemplate(this);
  }
}

customElements.define("workbench-activitybar", ActivitybarElement);
