import { html } from "lit";

function roleRow(host, role) {
  const isEditing = host.editingRoleId === role.id;
  return html`
    <div class="orgroles-row">
      ${isEditing
        ? html`<input
            class="ag-input orgroles-name-input"
            .value=${role.name}
            @blur=${(e) => host.handleRenameRole(role.id, e.target.value)}
            @keydown=${(e) => e.key === "Enter" && e.target.blur()}
          />`
        : html`<span
            class="orgroles-name"
            @dblclick=${() => (host.editingRoleId = role.id)}
            >${role.name}</span
          >`}

      <select
        class="ag-select orgroles-parent-select"
        .value=${role.parentId || ""}
        ?disabled=${role.id === "manager"}
        @change=${(e) =>
          host.handleChangeParent(role.id, e.target.value || null)}
      >
        <option value="">-- Không có cha --</option>
        ${host.org.roles
          .filter((r) => r.id !== role.id)
          .map((r) => html`<option value=${r.id}>${r.name}</option>`)}
      </select>

      <input
        class="ag-input orgroles-count-input"
        type="number"
        min="1"
        placeholder="SL"
        .value=${role.maxCount ?? ""}
        @change=${(e) => host.handleChangeMaxCount(role.id, e.target.value)}
      />

      <span class="orgroles-instance-count"
        >${host.instanceCounts[role.id] || 0} agent</span
      >

      ${role.id !== "manager"
        ? html`<button
            class="ag-danger-btn"
            @click=${() => host.handleDeleteRole(role.id)}
          >
            Xoá
          </button>`
        : ""}
    </div>
  `;
}

export function orgRolesViewTemplate(host) {
  if (!host.org) return html`<div class="ag-empty">Đang tải...</div>`;

  return html`
    <div class="ag-form orgroles-form">
      <div class="orgroles-header">
        ${host.editingOrgName
          ? html`<input
              class="ag-input"
              .value=${host.org.name}
              @blur=${(e) => host.handleRenameOrg(e.target.value)}
              @keydown=${(e) => e.key === "Enter" && e.target.blur()}
            />`
          : html`<h2 @dblclick=${() => (host.editingOrgName = true)}>
              ${host.org.name}
            </h2>`}
      </div>

      <div class="orgroles-list">
        ${host.org.roles.map((r) => roleRow(host, r))}
      </div>

      <div class="orgroles-add-row">
        <input
          class="ag-input"
          placeholder="Tên vai trò mới"
          .value=${host.newRoleName}
          @input=${(e) => (host.newRoleName = e.target.value)}
          @keydown=${(e) => e.key === "Enter" && host.handleAddRole()}
        />
        <button class="ag-btn-ghost" @click=${() => host.handleAddRole()}>
          + Thêm vai trò
        </button>
      </div>

      <div class="ag-actions orgroles-footer">
        <button class="ag-save-btn" @click=${() => host.handleSaveAsNew()}>
          Lưu thành org mới
        </button>
        <button class="ag-danger-btn" @click=${() => host.handleDeleteOrg()}>
          Xoá org này
        </button>
      </div>
    </div>
  `;
}
