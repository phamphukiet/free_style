import { html } from "lit";

export function sidebarTemplate(host) {
  let body;
  if (host.folderPath) {
    body = html`
      <div class="sidebar-title">${host.folderName}</div>
      <ul class="sidebar-list">
        ${host.items.map((item) => html`<li>${item.name}</li>`)}
      </ul>
    `;
  } else {
    body = html`
      <div class="sidebar-empty">
        <button
          class="sidebar-open-folder-btn"
          @click=${() => host.handleOpenFolder()}
        >
          Open Folder
        </button>
      </div>
    `;
  }
  return body;
}
