// editor-group.js
// Giai đoạn 1: chỉ chừa vùng hiển thị, chưa mount Monaco.
// Giai đoạn 2 sẽ thêm hàm mountEditor(container) tại đây.

import { LitElement, unsafeCSS } from "lit";
import { editorGroupTemplate } from "./editor-group.template.js";
import styles from "./editor-group.css?inline";
import "@modules/editor/frontend/editor-group/editor.js";

class EditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);

  render() {
    return editorGroupTemplate();
  }
}

customElements.define("workbench-editor-group", EditorGroupElement);
