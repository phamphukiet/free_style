import { html } from "lit";

// Giai đoạn 1: chừa rỗng. Giai đoạn 2 sẽ mount Monaco vào #editor-mount.
export function editorTemplate(host) {
  let content;
  if (host.hasFile) {
    content = html`<div id="editor-mount"></div>`;
  } else {
    content = html`<div class="editor-empty">Chưa có file nào được mở</div>`;
  }
  return content;
}
