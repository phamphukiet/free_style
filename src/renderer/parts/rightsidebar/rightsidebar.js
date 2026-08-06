// rightsidebar.js
// Trách nhiệm duy nhất: ẩn/hiện sidebar phải theo sự kiện toggle.
// Mặc định ẩn (visible = false). Không tự chứa nút bật/tắt —
// nút đặt ở titlebar, chỉ dispatch CustomEvent, tránh phụ thuộc trực tiếp.

import { LitElement, unsafeCSS } from "lit";
import { rightSidebarTemplate } from "./rightsidebar.template.js";
import styles from "./rightsidebar.css?inline";

class RightSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    visible: { state: true },
  };

  constructor() {
    super();
    this.visible = false;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workbench:toggle-rightsidebar", this.handleToggle);
  }

  disconnectedCallback() {
    window.removeEventListener(
      "workbench:toggle-rightsidebar",
      this.handleToggle,
    );
    super.disconnectedCallback();
  }

  handleToggle = () => {
    this.visible = !this.visible;
  };

  updated(changedProperties) {
    if (changedProperties.has("visible")) {
      this.style.display = this.visible ? "flex" : "none";
    }
  }

  render() {
    return rightSidebarTemplate(this);
  }
}

customElements.define("workbench-rightsidebar", RightSidebarElement);
