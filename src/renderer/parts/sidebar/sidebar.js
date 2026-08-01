import { LitElement, unsafeCSS } from "lit";
import { sidebarTemplate } from "./sidebar.template.js";
import { openFolder } from "@shared/folder-actions.js";
import styles from "./sidebar.css?inline";
import "@modules/editor/frontend/ed-siderbar/sidebar.js";

class SidebarElement extends LitElement {
  static styles = unsafeCSS(styles);

  render() {
    return sidebarTemplate();
  }
}

customElements.define("workbench-sidebar", SidebarElement);
