// pv-editor-group/editor.js
import { LitElement, unsafeCSS } from "lit";
import { pvEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";

class PvEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);

  handleSelect(id) {
    // Tương lai: click vào provider card sẽ mở chat/config của provider đó
    window.dispatchEvent(
      new CustomEvent("providers:select", { detail: { providerId: id } })
    );
  }

  render() {
    return pvEditorTemplate(this);
  }
}

customElements.define("module-pv-editor-group", PvEditorGroupElement);
