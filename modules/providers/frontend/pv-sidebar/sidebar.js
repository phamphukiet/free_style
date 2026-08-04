// pv-sidebar/sidebar.js
import { LitElement, unsafeCSS } from "lit";
import { pvSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";

class PvSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = { activeId: { type: String } };

  constructor() {
    super();
    this.activeId = "";
  }

  handleSelect(id) {
    this.activeId = id;
    window.dispatchEvent(
      new CustomEvent("providers:select", { detail: { providerId: id } })
    );
  }

  render() {
    return pvSidebarTemplate(this);
  }
}

customElements.define("module-pv-sidebar", PvSidebarElement);
