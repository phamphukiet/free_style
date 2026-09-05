import { html, unsafeStatic } from "lit/static-html.js";

export function editorTemplate(tagName, contextId) {
  if (!tagName) {
    return html`<div class="ag-empty">
      Chọn hoặc tạo agent ở sidebar bên trái
    </div>`;
  }
  const tag = unsafeStatic(tagName);
  return html`<${tag} .contextId=${contextId}></${tag}>`;
}
