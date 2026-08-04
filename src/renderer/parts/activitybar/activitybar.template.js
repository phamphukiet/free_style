// activitybar.template.js
import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { classMap } from "lit/directives/class-map.js";

export function activitybarTemplate(host) {
  return html`
    ${host.items.map(
      (item) => html`
        <button
          class=${classMap({
            "activitybar-icon": true,
            active: host.activeId === item.id,
          })}
          title=${item.title || item.id}
          @click=${() => host.handleIconClick(item.id)}
        >
          ${unsafeSVG(item.icon)}
        </button>
      `,
    )}
  `;
}
