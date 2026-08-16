// panel.js
// Trách nhiệm duy nhất: khung chứa panel dưới cùng (ẩn/hiện, chiều cao cố định).
// KHÔNG biết nội dung bên trong là gì (terminal, output...) — chỉ mount tag đã
// đăng ký qua registry.registerPanelView(). Module cung cấp panel bị xóa →
// registry trả null → tự hiện empty state, không lỗi.

import { LitElement, unsafeCSS } from "lit";
import { panelTemplate } from "./panel.template.js";
import styles from "./panel.css?inline";
import { registry } from "@modules/registry.js";

class PanelElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    visible: { type: Boolean },
  };

  constructor() {
    super();
    this.visible = true;
  }

  connectedCallback() {
    super.connectedCallback();
    // Nội dung con (VD module-terminal-panel) tự dispatch sự kiện này khi cần đóng.
    this.addEventListener("panel:close", this.handleClose);
  }

  disconnectedCallback() {
    this.removeEventListener("panel:close", this.handleClose);
    super.disconnectedCallback();
  }

  handleClose = () => {
    this.visible = false;
    this.style.display = "none";
  };

  render() {
    return panelTemplate(registry.getPanelView());
  }
}

customElements.define("workbench-panel", PanelElement);
