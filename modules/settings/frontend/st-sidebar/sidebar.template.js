import { html } from "lit";
import { classMap } from "lit/directives/class-map.js";

export function stSidebarTemplate(host) {
  if (host.groups.length === 0) {
    return html`<div class="st-sidebar-empty">Chưa có setting nào</div>`;
  }
  return html`
    ${host.groups.map(
      (group) => html`
        <div
          class=${classMap({
            "st-group-item": true,
            active: host.activeGroup === group,
          })}
          @click=${() => host.handleSelect(group)}
        >
          <span class="st-group-name">${group}</span>
        </div>
      `,
    )}
  `;
}
