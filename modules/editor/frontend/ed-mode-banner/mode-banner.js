// mode-banner.js
// Dải trên cùng sidebar Explorer khi ở một "chế độ" tạm. Chỉ phát CustomEvent, không biết ai tạo ra chế độ.

import { LitElement, unsafeCSS } from "lit";
import { modeBannerTemplate } from "./mode-banner.template.js";
import styles from "./mode-banner.css?inline";

class ModeBannerElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = { label: { type: String } };

  constructor() {
    super();
    this.label = "";
  }

  handleExit() {
    window.dispatchEvent(new CustomEvent("workbench:explorer-mode-exit"));
  }

  render() {
    return modeBannerTemplate(this);
  }
}

customElements.define("ed-mode-banner", ModeBannerElement);
