import { LitElement, unsafeCSS } from "lit";
import { contextMenuTemplate } from "./context-menu.template.js";
import styles from "./context-menu.css?inline";

class ContextMenuElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    items: { type: Array },
    x: { type: Number },
    y: { type: Number },
  };

  constructor() {
    super();
    this.items = [];
    this.x = 0;
    this.y = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    // Trễ 1 tick để không bắt trúng chính click vừa mở menu.
    setTimeout(() => {
      window.addEventListener("click", this.handleOutsideClick);
    }, 0);
  }

  disconnectedCallback() {
    window.removeEventListener("click", this.handleOutsideClick);
    super.disconnectedCallback();
  }

  handleOutsideClick = () => {
    this.dispatchEvent(new CustomEvent("close"));
  };

  handleItemClick(item) {
    item.onClick();
  }

  render() {
    return contextMenuTemplate(this);
  }
}

customElements.define("ed-context-menu", ContextMenuElement);
