import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import newFileIcon from "lucide-static/icons/file-plus.svg?raw";
import newFolderIcon from "lucide-static/icons/folder-plus.svg?raw";
import collapseIcon from "lucide-static/icons/chevrons-up-down.svg?raw";
import refreshIcon from "lucide-static/icons/refresh-cw.svg?raw";
import fileIcon from "lucide-static/icons/file.svg?raw";
import folderIcon from "lucide-static/icons/folder.svg?raw";

export function sidebarTemplate(host) {
  if (!host.folderPath) {
    return html`
      <div class="sidebar-empty">
        <p>Chưa mở thư mục nào</p>
        <button class="sidebar-open-folder-btn" @click=${() => host.handleOpenFolder()}>
          Open Folder
        </button>
      </div>
    `;
  }

  const menu = host.menuOpen ? html`
    <ed-context-menu
      .items=${host.menuItems}
      .x=${host.menuX}
      .y=${host.menuY}
      @close=${() => host.closeMenu()}
    ></ed-context-menu>
  ` : html``;

  let createInput = html``;
  if (host.creatingType) {
    const icon = host.creatingType === "folder"
      ? html`<span class="tree-icon" style="color:#dcb67a">${unsafeSVG(folderIcon)}</span>`
      : html`<span class="tree-icon" style="color:#cccccc">${unsafeSVG(fileIcon)}</span>`;
    createInput = html`
      <div class="tree-row" style="padding-left: 16px">
        ${icon}
        <input
          class="rename-input create-input"
          placeholder=${host.creatingType === "file" ? "File name" : "Folder name"}
          @blur=${(e) => host.handleCreateConfirm(e)}
          @keydown=${(e) => {
            if (e.key === "Enter") e.target.blur();
            if (e.key === "Escape") {
              e.stopPropagation();
              host.creatingType = null;
            }
          }}
        />
      </div>
    `;
  }

  return html`
    <div class="sidebar-header">
      <span class="sidebar-header-title">${host.folderName}</span>
      <div class="sidebar-header-actions">
        <button class="icon-btn" title="New File"
          @click=${() => host.handleNewFile()}>${unsafeSVG(newFileIcon)}</button>
        <button class="icon-btn" title="New Folder"
          @click=${() => host.handleNewFolder()}>${unsafeSVG(newFolderIcon)}</button>
        <button class="icon-btn" title="Refresh Explorer"
          @click=${() => host.handleReload()}>${unsafeSVG(refreshIcon)}</button>
        <button class="icon-btn" title="Collapse All"
          @click=${() => host.handleCollapseAll()}>${unsafeSVG(collapseIcon)}</button>
      </div>
    </div>
    <div class="sidebar-content" @contextmenu=${(e) => host.handleContextMenu(e)}>
      ${createInput}
      ${host.items.map((item) => html`
        <ed-tree-item
          name=${item.name}
          path=${`${host.folderPath}/${item.name}`}
          ?isDirectory=${item.isDirectory}
          depth=${0}
          .selectedPath=${host.selectedPath}
        ></ed-tree-item>
      `)}
    </div>
    ${menu}
  `;
}
