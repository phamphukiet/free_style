import { html } from "lit";

export function contextMenuTemplate(host) {
  if (!host.menuOpen) return html``;
  return html`
    <div
      class="ag-context-menu"
      style="left:${host.menuX}px;top:${host.menuY}px"
    >
      <button
        class="menu-item"
        @click=${() => host.handleRenameStart(host.menuTargetId)}
      >
        Rename
      </button>
      ${host.menuTargetId !== "manager"
        ? html`<button
            class="menu-item"
            @click=${() => host.handleDelete(host.menuTargetId)}
          >
            Delete
          </button>`
        : ""}
    </div>
  `;
}
