import { html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import chevronIcon from "lucide-static/icons/chevron-right.svg?raw";

// section: { id, title, items: [{id, label}], emptyText }
export function sectionTemplate(host, section) {
  const collapsed = host.collapsedSections[section.id];
  return html`
    <div class="rl-section">
      <div
        class="rl-section-header"
        @click=${() => host.toggleSection(section.id)}
      >
        <span class="rl-section-chevron ${collapsed ? "" : "open"}">
          ${unsafeSVG(chevronIcon)}
        </span>
        <span class="rl-section-title">${section.title}</span>
        <span class="rl-section-count">${section.items.length}</span>
      </div>
      ${!collapsed
        ? html`
            <div class="rl-section-body">
              ${section.items.length === 0
                ? html`<div class="rl-section-empty">${section.emptyText}</div>`
                : section.items.map(
                    (item) => html`
                      <div
                        class=${classMap({
                          "rl-item": true,
                          active: host.selectedId === item.id,
                        })}
                        @click=${() => host.handleSelect(item.id)}
                      >
                        <span class="rl-item-name">${item.label}</span>
                      </div>
                    `,
                  )}
            </div>
          `
        : ""}
    </div>
  `;
}
