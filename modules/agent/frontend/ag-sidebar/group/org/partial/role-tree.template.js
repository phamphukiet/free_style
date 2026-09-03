import { html } from "lit";
import { classMap } from "lit/directives/class-map.js";

function roleRow(host, role) {
  const nameBlock =
    host.orgEditingId === role.id
      ? html`<input
          class="rename-input org-rename-input"
          .value=${role.name}
          @blur=${(e) => host.handleRoleRenameConfirm(e, role.id)}
          @keydown=${(e) => {
            if (e.key === "Enter") e.target.blur();
            if (e.key === "Escape") {
              e.stopPropagation();
              host.handleRoleRenameCancel();
            }
          }}
        />`
      : html`<span class="ag-item-name">${role.name}</span>`;

  return html`
    <div
      class=${classMap({
        "ag-item": true,
        active: host.selectedRoleId === role.id,
      })}
      @click=${() => host.handleSelectRole(role.id)}
      @contextmenu=${(e) => host.handleRoleContextMenu(e, role.id)}
    >
      ${nameBlock}
    </div>
  `;
}

function childrenOf(roles, parentId) {
  return roles.filter((r) => r.parentId === parentId);
}

export function roleTree(host, roles, parentId, depth = 0) {
  return childrenOf(roles, parentId).map(
    (r) => html`
      <div style="padding-left:${depth * 14}px">${roleRow(host, r)}</div>
      ${roleTree(host, roles, r.id, depth + 1)}
    `,
  );
}
