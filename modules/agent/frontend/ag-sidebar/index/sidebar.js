import { LitElement, unsafeCSS } from "lit";
import { sidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";
import "../group/index/index.js";
import { getSidebarGroups } from "../group/index/group-registry.js";

class AgSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);

  render() {
    return sidebarTemplate(getSidebarGroups());
  }
}

customElements.define("module-ag-sidebar", AgSidebarElement);
