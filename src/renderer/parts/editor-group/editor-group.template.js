import { html } from "lit";

// Giai đoạn 1: chừa rỗng. Giai đoạn 2 sẽ mount Monaco vào #editor-mount.
export function editorGroupTemplate() {
  return html`<module-editor></module-editor>`;
}
