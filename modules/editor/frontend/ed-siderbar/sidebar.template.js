import { html } from "lit";

export function sidebarTemplate(host) {
  let body;
  if (host.folderPath) {
    let menu;
    if (host.menuOpen) {
      menu = html`
        <ed-context-menu
          .items=${[
            { label: "New File", onClick: () => host.handleNewFile() },
            { label: "New Folder", onClick: () => host.handleNewFolder() },
          ]}
          .x=${host.menuX}
          .y=${host.menuY}
          @close=${() => host.closeMenu()}
        ></ed-context-menu>
      `;
    } else {
      menu = html``;
    }

    body = html`
      <div class="sidebar-title">${host.folderName}</div>
      <div
        class="sidebar-tree"
        @contextmenu=${(e) => host.handleContextMenu(e)}
      >
        ${host.items.map(
          (item) => html`
            <ed-tree-item
              name=${item.name}
              path=${`${host.folderPath}/${item.name}`}
              ?isDirectory=${item.isDirectory}
              depth=${0}
            ></ed-tree-item>
          `,
        )}
      </div>
      ${menu}
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
