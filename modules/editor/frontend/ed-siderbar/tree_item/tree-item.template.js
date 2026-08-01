import { html } from "lit";

export function treeItemTemplate(host) {
  let icon;
  if (!host.isDirectory) {
    icon = "";
  } else if (host.expanded) {
    icon = "▾";
  } else {
    icon = "▸";
  }

  let childrenBlock;
  if (host.expanded && host.children) {
    childrenBlock = html`
      <div class="tree-children">
        ${host.children.map(
          (child) => html`
            <ed-tree-item
              name=${child.name}
              path=${`${host.path}/${child.name}`}
              ?isDirectory=${child.isDirectory}
              depth=${host.depth + 1}
            ></ed-tree-item>
          `,
        )}
      </div>
    `;
  } else {
    childrenBlock = html``;
  }

  const menuItems = [];
  if (host.isDirectory) {
    menuItems.push({ label: "New File", onClick: () => host.handleNewFile() });
    menuItems.push({
      label: "New Folder",
      onClick: () => host.handleNewFolder(),
    });
  }
  menuItems.push({ label: "Rename", onClick: () => host.handleRename() });
  menuItems.push({ label: "Delete", onClick: () => host.handleDelete() });

  let menu;
  if (host.menuOpen) {
    menu = html`
      <ed-context-menu
        .items=${menuItems}
        .x=${host.menuX}
        .y=${host.menuY}
        @close=${() => host.closeMenu()}
      ></ed-context-menu>
    `;
  } else {
    menu = html``;
  }
  
  return html`
    <div
      class="tree-row"
      style="padding-left: ${host.depth * 12}px"
      @click=${() => host.handleToggle()}
      @contextmenu=${(e) => host.handleContextMenu(e)}
    >
    >
      <span class="tree-icon">${icon}</span>
      <span class="tree-name">${host.name}</span>
    </div>
    ${childrenBlock}
  `;
}
