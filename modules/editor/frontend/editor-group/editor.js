import { LitElement, unsafeCSS } from "lit";
import { editorTemplate } from "./editor.template.js";
import { mountEditor } from "../mount.js";
import styles from "./editor.css?inline";

class EditorElement extends LitElement {
  static styles = unsafeCSS(styles);

  // Monaco tự chèn CSS vào document.head, không xuyên được Shadow DOM.
  // Render ra Light DOM để Monaco hoạt động đúng như bình thường.

  firstUpdated() {
    const mountPoint = this.shadowRoot.getElementById("editor-mount");
    this.instance = mountEditor(mountPoint);
  }

  render() {
    return editorTemplate();
  }
}

customElements.define("module-editor", EditorElement);
