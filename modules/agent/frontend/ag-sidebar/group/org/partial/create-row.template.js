import { html } from "lit";

export function createRow(host) {
  if (!host.orgCreating) return html``;
  const parents = host.org?.roles || [];
  return html`
    <div class="ag-item org-create-row">
      <select
        class="org-parent-select"
        .value=${host.orgNewParentId ?? ""}
        @change=${(e) => host.setNewRoleParent(e.target.value)}
      >
        <option value="">-- Không có cha --</option>
        ${parents.map((r) => html`<option value=${r.id}>${r.name}</option>`)}
      </select>
      <input
        class="rename-input create-input"
        placeholder="Tên vai trò"
        @blur=${(e) => host.handleCreateRoleConfirm(e)}
        @keydown=${(e) => {
          if (e.key === "Enter") e.target.blur();
          if (e.key === "Escape") {
            e.stopPropagation();
            host.cancelCreateRole();
          }
        }}
      />
    </div>
  `;
}
