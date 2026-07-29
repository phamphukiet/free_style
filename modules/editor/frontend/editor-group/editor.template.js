import { html } from "lit";

// Chỉ có 1 mount point — Monaco tự vẽ nội dung bên trong qua mount.js,
// không có markup tĩnh nào khác cần Lit quản lý.
export function editorTemplate() {
  return html`<div id="editor-mount"></div>`;
}
