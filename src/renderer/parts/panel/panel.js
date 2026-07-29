// panel.js
// Giai đoạn 1: chỉ chừa vùng hiển thị, chưa mount xterm.
// Giai đoạn 2 sẽ thêm hàm mountTerminal(container) tại đây.

import { LitElement, unsafeCSS } from "lit";
import { panelTemplate } from "./panel.template.js";
import styles from "./panel.css?inline";

class PanelElement extends LitElement {
  static styles = unsafeCSS(styles);

  render() {
    return panelTemplate();
  }
}

customElements.define("workbench-panel", PanelElement);
