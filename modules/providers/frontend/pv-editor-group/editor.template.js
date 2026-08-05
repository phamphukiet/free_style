// editor.template.js
import { html, unsafeStatic } from "lit/static-html.js";
import { registry } from "@modules/registry.js";
import { dashboardTemplate } from "./dashboard.template.js";

export function pvEditorTemplate(host) {
  if (host.activeProviderId) {
    const tagName = registry.getProviderEditorView(host.activeProviderId);
    if (tagName) {
      const tag = unsafeStatic(tagName);
      return html`
        <div style="padding: 20px; display: flex; flex-direction: column; height: 100%;">
          <div style="margin-bottom: 20px;">
            <button @click=${() => host.handleBack()} style="background: var(--bg-modifier-hover); color: var(--text-normal); border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
              &larr; Quay lại
            </button>
          </div>
          <div style="flex: 1;">
            <${tag}></${tag}>
          </div>
        </div>
      `;
    }
  }

  return dashboardTemplate(host);
}
