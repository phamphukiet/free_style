import { html, unsafeStatic } from "lit/static-html.js";
import { registry } from "@modules/registry.js";

export function rightSidebarTemplate() {
  const tagName = registry.getRightSidebarView();
  const tag = tagName ? unsafeStatic(tagName) : null;

  return html`
    <div class="rightsidebar-header">
      <span>Chat</span>
    </div>
    <div class="rightsidebar-content">
      ${tag
        ? html`<${tag}></${tag}>`
        : html`<div class="rightsidebar-empty">Chưa có nội dung</div>`}
    </div>
  `;
}
