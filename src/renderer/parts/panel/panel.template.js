// panel.template.js
import { html, unsafeStatic } from "lit/static-html.js";

export function panelTemplate(tagName) {
  if (!tagName) {
    return html`<div class="panel-empty">Không có panel nào được đăng ký</div>`;
  }
  const tag = unsafeStatic(tagName);
  return html`<${tag}></${tag}>`;
}