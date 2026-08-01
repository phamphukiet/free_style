// editor-group.js
// Giai đoạn 1: chỉ chừa vùng hiển thị, chưa mount Monaco.
// Giai đoạn 2 sẽ thêm hàm mountEditor(container) tại đây.

import { LitElement, unsafeCSS } from "lit";
import { editorGroupTemplate } from "./editor-group.template.js";
import styles from "./editor-group.css?inline";
import "@modules/editor/frontend/editor-group/editor.js";

class EditorElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    hasFile: { type: Boolean },
  };

  constructor() {
    super();
    // Giai đoạn 2: chưa có cơ chế mở file thật → mặc định false,
    // hiện màn hình trống. Giai đoạn 3+ sẽ set true qua registry
    // khi có file được mở.
    this.hasFile = false;
  }

  // Thay firstUpdated() bằng updated(): vì #editor-mount giờ chỉ tồn tại
  // khi hasFile === true (render có điều kiện), nên phải chờ nó xuất hiện
  // trong DOM rồi mới mount Monaco, không mount 1 lần cố định như trước.
  updated() {
    if (this.hasFile && !this.instance) {
      const mountPoint = this.shadowRoot.getElementById("editor-mount");
      if (mountPoint) this.instance = mountEditor(mountPoint);
    }
  }

  render() {
    return editorTemplate(this);
  }
}

customElements.define("workbench-editor-group", EditorGroupElement);
