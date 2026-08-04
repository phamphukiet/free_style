// sidebar.template.js
import { html, unsafeStatic } from "lit/static-html.js";

export function sidebarTemplate(host, tagName) {
  if (!tagName) {
    return html`<div class="sidebar-empty">No view registered for ${host.activeTab}</div>`;
  }
  
  const tag = unsafeStatic(tagName);
  return html`
    <div class="sidebar-content">
      <${tag}></${tag}>
    </div>
  `;
}
