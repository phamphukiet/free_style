// pv-editor-group/editor.js
import { LitElement, unsafeCSS } from "lit";
import { pvEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";

class PvEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = { activeProviderId: { type: String } };

  constructor() {
    super();
    this.activeProviderId = "";
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("providers:select", this.handleProviderSelect);
  }

  disconnectedCallback() {
    window.removeEventListener("providers:select", this.handleProviderSelect);
    super.disconnectedCallback();
  }

  handleProviderSelect = (e) => {
    this.activeProviderId = e.detail.providerId;
  };

  handleSelect(id) {
    window.dispatchEvent(
      new CustomEvent("providers:select", { detail: { providerId: id } })
    );
  }

  handleBack() {
    this.activeProviderId = "";
    // also notify sidebar to clear selection if we want
    window.dispatchEvent(
      new CustomEvent("providers:select", { detail: { providerId: "" } })
    );
  }

  render() {
    return pvEditorTemplate(this);
  }
}

customElements.define("module-pv-editor-group", PvEditorGroupElement);
