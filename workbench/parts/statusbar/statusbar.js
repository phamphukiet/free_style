// statusbar.js
// Giai đoạn 1: chỉ hiện vài mục tĩnh cứng để thấy layout.
// Chưa nối dữ liệu thật (branch, encoding, vị trí con trỏ).

import { LitElement, unsafeCSS } from "lit";
import { statusbarTemplate } from "./statusbar.template.js";
import styles from "./statusbar.css?inline";

class StatusbarElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    branch: { type: String },
    encoding: { type: String },
    language: { type: String },
    cursorPosition: { type: String },
  };

  constructor() {
    super();
    this.branch = "main";
    this.encoding = "UTF-8";
    this.language = "JavaScript";
    this.cursorPosition = "Ln 1, Col 1";
  }

  render() {
    return statusbarTemplate(this);
  }
}

customElements.define("workbench-statusbar", StatusbarElement);
