import { html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import chevronIcon from "lucide-static/icons/chevron-right.svg?raw";

// section: { id, title, items: [{id, label, meta?}], emptyText }
export function sectionTemplate(host, section) {
  const collapsed = host.collapsedSections[section.id];
  return html`
    <div class="sk-section">
      <div
        class="sk-section-header"
        @click=${() => host.toggleSection(section.id)}
      >
        <span class="sk-section-chevron ${collapsed ? "" : "open"}">
          ${unsafeSVG(chevronIcon)}
        </span>
        <span class="sk-section-title">${section.title}</span>
        <span class="sk-section-count">${section.items.length}</span>
      </div>
      ${!collapsed
        ? html`
            <div class="sk-section-body">
              ${section.items.length === 0
                ? html`<div class="sk-section-empty">${section.emptyText}</div>`
                : section.items.map(
                    (item) => html`
                      <div
                        class=${classMap({
                          "sk-item": true,
                          "sk-item-compact": true,
                          active: host.selectedId === item.id,
                        })}
                        @click=${() => host.handleSelect(item.id)}
                      >
                        <span class="sk-item-name">${item.label}</span>
                        ${item.meta
                          ? html`<span class="sk-item-meta">${item.meta}</span>`
                          : ""}
                      </div>
                    `,
                  )}
            </div>
          `
        : ""}
    </div>
  `;
}
