import { html } from "lit";

export function contextMenuTemplate(host) {
  return html`
    <div class="context-menu" style="left:${host.x}px;top:${host.y}px">
      ${host.items.map((item) =>
        item.type === "separator"
          ? html`<div class="menu-separator"></div>`
          : html`<button
              class="menu-item"
              @click=${() => host.handleItemClick(item)}
            >${item.label}</button>`
      )}
    </div>
  `;
}
