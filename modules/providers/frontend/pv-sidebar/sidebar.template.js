// sidebar.template.js
import { html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { registry } from "@modules/registry.js";

export function pvSidebarTemplate(host) {
  const providers = registry.getProviders();
  const groups = [...new Set(providers.map((p) => p.group))];

  return html`
    ${groups.map(
      (group) => html`
        <div class="section-title">${group}</div>
        ${providers.filter((p) => p.group === group).map(
          (p) => html`
            <div
              class=${classMap({
                "provider-item": true,
                active: host.activeId === p.id,
              })}
              @click=${() => host.handleSelect(p.id)}
            >
              <span
                class="provider-icon"
                style="background:${p.color}; color:${p.textColor ?? "#fff"}"
              >${p.abbr}</span>
              <span class="provider-name">${p.name}</span>
            </div>
          `
        )}
        <div class="divider"></div>
      `
    )}
  `;
}
