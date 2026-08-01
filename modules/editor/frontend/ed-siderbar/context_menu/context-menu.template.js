import { html } from "lit";

export function contextMenuTemplate(host) {
  return html`
    <div class="context-menu" style="left: ${host.x}px; top: ${host.y}px">
      ${host.items.map(
        (item) => html`
          <button @click=${() => host.handleItemClick(item)}>
            ${item.label}
          </button>
        `,
      )}
    </div>
  `;
}
