import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import fileIcon from "lucide-static/icons/file.svg?raw";
import folderIcon from "lucide-static/icons/folder.svg?raw";
import folderOpenIcon from "lucide-static/icons/folder-open.svg?raw";

function getFileIcon(name) {
  const ext = name.split(".").pop()?.toLowerCase();
  const colors = {
    js: "#f7df1e", ts: "#3178c6", css: "#42a5f5", html: "#e34c26",
    json: "#cbcb41", md: "#519aba", py: "#3572a5", svg: "#ff9900",
  };
  const color = colors[ext] || "#cccccc";
  return html`<span style="color:${color}">${unsafeSVG(fileIcon)}</span>`;
}

export function treeItemTemplate(host) {
  const indent = host.depth * 12;

  const chevron = host.isDirectory
    ? html`<span class="tree-chevron ${host.expanded ? "open" : ""}">&#9658;</span>`
    : html`<span class="tree-chevron"></span>`;

  const icon = host.isDirectory
    ? html`<span class="tree-icon" style="color:#dcb67a">
        ${unsafeSVG(host.expanded ? folderOpenIcon : folderIcon)}
      </span>`
    : html`<span class="tree-icon">${getFileIcon(host.name)}</span>`;

  const nameBlock = host.renaming
    ? html`<input
        class="rename-input"
        .value=${host.name}
        @blur=${(e) => host.handleRenameConfirm(e)}
        @keydown=${(e) => {
          if (e.key === "Enter") e.target.blur();
          if (e.key === "Escape") { e.stopPropagation(); host.handleRenameCancel(e); }
        }}
      />`
    : html`<span class="tree-name">${host.name}</span>`;

  let children = html``;
  if (host.expanded && (host.children || host.creatingType)) {
    let createInput = html``;
    if (host.creatingType) {
      const cIndent = (host.depth + 1) * 12;
      const cIcon = host.creatingType === "folder"
        ? html`<span class="tree-icon" style="color:#dcb67a">${unsafeSVG(folderIcon)}</span>`
        : html`<span class="tree-icon" style="color:#cccccc">${unsafeSVG(fileIcon)}</span>`;
      createInput = html`
        <div class="tree-row" style="padding-left:${cIndent}px">
          <span class="tree-chevron"></span>
          ${cIcon}
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

    children = html`<div class="tree-children">
      ${createInput}
      ${(host.children || []).map((child) => html`
        <ed-tree-item
          name=${child.name}
          path=${`${host.path}/${child.name}`}
          ?isDirectory=${child.isDirectory}
          depth=${host.depth + 1}
          .selectedPath=${host.selectedPath}
        ></ed-tree-item>`)}
    </div>`;
  }

  return html`
    <div
      class="tree-row ${
        host.path === host.selectedPath ? "selected" : ""
      } ${host.dragOver ? "drag-over" : ""}" ${host.isCut ? "cut" : ""}"
      style="padding-left:${indent}px"
      draggable="true"
      @dragstart=${(e) => host.handleDragStart(e)}
      @dragover=${(e) => host.handleDragOver(e)}
      @dragleave=${() => host.handleDragLeave()}
      @drop=${(e) => host.handleDrop(e)}
      @click=${() => host.handleToggle()}
      @contextmenu=${(e) => host.handleContextMenu(e)}
    >
      ${chevron}${icon}${nameBlock}
    </div>
    ${children}
  `;
}
