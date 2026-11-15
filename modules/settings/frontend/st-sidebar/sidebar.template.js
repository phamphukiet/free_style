import { html } from "lit";
import { classMap } from "lit/directives/class-map.js";

function itemTemplate({ host, id, label }) {
  return html`
    <div
      class=${classMap({
        "st-group-item": true,
        active: host.activeGroup === id,
      })}
      @click=${() => host.handleSelect(id)}
    >
      <span class="st-group-name">${label}</span>
    </div>
  `;
}

export function stSidebarTemplate(host) {
  const groups =
    host.groups.length === 0
      ? html`<div class="st-sidebar-empty">Chưa có setting nào</div>`
      : host.groups.map((group) =>
          itemTemplate({ host, id: group, label: group }),
        );
  const pages =
    host.pages.length === 0
      ? ""
      : html`<div class="st-page-divider"></div>
          ${host.pages.map((p) =>
            itemTemplate({ host, id: p.id, label: p.label }),
          )}`;
  return html`${groups}${pages}`;
}
