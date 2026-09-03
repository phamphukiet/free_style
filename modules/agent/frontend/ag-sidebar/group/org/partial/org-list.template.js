import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { classMap } from "lit/directives/class-map.js";
import playIcon from "lucide-static/icons/play.svg?raw";
import trashIcon from "lucide-static/icons/trash-2.svg?raw";

function orgRow(host, org) {
  const isActive = org.id === host.activeOrgId;
  const isSelected = org.id === host.selectedOrgId;

  return html`
    <div
      class=${classMap({
        "ag-item": true,
        "org-item": true,
        active: isSelected,
        "org-active": isActive,
      })}
      @click=${() => host.handleSelectOrg(org.id)}
    >
      <span class="ag-item-name">${org.name}</span>
      ${isActive
        ? html`<span class="org-badge">Đang dùng</span>`
        : html`<button
            class="icon-btn"
            title="Kích hoạt org này"
            @click=${(e) => {
              e.stopPropagation();
              host.handleRequestActivate(org.id);
            }}
          >
            ${unsafeSVG(playIcon)}
          </button>`}
      <button
        class="icon-btn"
        title="Xoá"
        @click=${(e) => {
          e.stopPropagation();
          host.handleDeleteOrg(org.id);
        }}
      >
        ${unsafeSVG(trashIcon)}
      </button>
    </div>
  `;
}

export function orgListTemplate(host) {
  return html`
    <div class="ag-sidebar-header org-header">
      <span class="ag-sidebar-title" @click=${() => host.toggleOrgSection()}
        >Org</span
      >
      <button
        class="icon-btn"
        title="Org mới"
        @click=${() => host.startCreateOrg()}
      >
        +
      </button>
    </div>
    ${!host.orgCollapsed
      ? html`
          <div class="ag-sidebar-list org-list">
            ${host.orgs.map((o) => orgRow(host, o))}
            ${host.orgs.length === 0
              ? html`<div class="ag-sidebar-empty">Chưa có org nào</div>`
              : ""}
          </div>
        `
      : ""}
  `;
}
