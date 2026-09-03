import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { classMap } from "lit/directives/class-map.js";
import botIcon from "lucide-static/icons/bot.svg?raw";
import plusIcon from "lucide-static/icons/plus.svg?raw";
import { contextMenuTemplate } from "./partial/context-menu.template.js";

function agItemTemplate(host, a) {
  const nameBlock =
    host.editingId === a.id
      ? html`<input
          class="rename-input"
          .value=${a.name}
          @blur=${(e) => host.handleRenameConfirm(e, a.id)}
          @keydown=${(e) => {
            if (e.key === "Enter") e.target.blur();
            if (e.key === "Escape") {
              e.stopPropagation();
              host.handleRenameCancel();
            }
          }}
        />`
      : html`<span class="ag-item-name">${a.name}</span>`;

  return html`
    <div
      class=${classMap({ "ag-item": true, active: host.activeId === a.id })}
      @click=${() => host.handleSelect(a.id)}
      @contextmenu=${(e) => host.handleContextMenu(e, a.id)}
    >
      <span class="ag-item-icon">${unsafeSVG(botIcon)}</span>
      ${nameBlock}
    </div>
  `;
}

export function agentGroupTemplate(host) {
  const createRow = host.creating
    ? html`
        <div class="ag-item">
          <span class="ag-item-icon">${unsafeSVG(botIcon)}</span>
          <input
            class="rename-input create-input"
            placeholder="Agent name"
            @blur=${(e) => host.handleCreateConfirm(e)}
            @keydown=${(e) => {
              if (e.key === "Enter") e.target.blur();
              if (e.key === "Escape") {
                e.stopPropagation();
                host.creating = false;
              }
            }}
          />
        </div>
      `
    : html``;

  return html`
    <div class="ag-sidebar-header">
      <span class="ag-sidebar-title">Agents</span>
      <button
        class="icon-btn"
        title="New Agent"
        @click=${() => host.startCreate()}
      >
        ${unsafeSVG(plusIcon)}
      </button>
    </div>
    <div class="ag-sidebar-list">
      ${createRow} ${host.agents.map((a) => agItemTemplate(host, a))}
      ${host.agents.length === 0 && !host.creating
        ? html`<div class="ag-sidebar-empty">Chưa có agent nào</div>`
        : ""}
    </div>
    ${contextMenuTemplate(host)}
  `;
}
