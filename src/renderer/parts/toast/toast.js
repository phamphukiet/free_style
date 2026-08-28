// toast.js
// Hiện thông báo ngắn khi có sự kiện "workbench:toast" — bất kỳ module nào
// cũng có thể bắn event này, không cần biết toast tồn tại.

import { LitElement, unsafeCSS } from "lit";
import { toastTemplate } from "./toast.template.js";
import styles from "./toast.css?inline";

let seq = 0;

class ToastElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = { items: { state: true } };

  constructor() {
    super();
    this.items = [];
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workbench:toast", this.handleToast);
  }

  disconnectedCallback() {
    window.removeEventListener("workbench:toast", this.handleToast);
    super.disconnectedCallback();
  }

  handleToast = (e) => {
    const id = ++seq;
    this.items = [...this.items, { id, message: e.detail.message }];
    setTimeout(() => {
      this.items = this.items.filter((t) => t.id !== id);
    }, 3000);
  };

  render() {
    return toastTemplate(this);
  }
}

customElements.define("workbench-toast", ToastElement);
