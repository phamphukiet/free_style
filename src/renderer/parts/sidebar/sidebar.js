import { LitElement, unsafeCSS } from "lit";
import { sidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";

class SidebarElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    items: { type: Array },
  };

  constructor() {
    super();
    // Giai đoạn 1: dữ liệu cứng. Module thật sau này gọi
    // registry.get('sidebar').items = [...] để cập nhật.
    this.items = [
      "electron-main/",
      "workbench/",
      "modules/",
      "shared/",
      "package.json",
    ];
  }

  render() {
    return sidebarTemplate(this);
  }
}

customElements.define("workbench-sidebar", SidebarElement);
