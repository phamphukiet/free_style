import { html } from "lit";
import { addInstanceForm } from "./partial/add-instance.template.js";

export function orgViewTemplate(host) {
  const role = host.role;
  if (!role)
    return html`<div class="ag-empty">
      Vai trò không tồn tại hoặc đã bị xoá
    </div>`;
  const isManager = role.id === "manager";

  return html`
    <div class="ag-form">
      <h2>${role.name}</h2>

      <label class="ag-label">Thuộc vai trò cha</label>
      <select
        class="ag-select"
        .value=${role.parentId || ""}
        ?disabled=${isManager}
        @change=${(e) =>
          host._roleH.handleRoleParentChange(e.target.value || null)}
      >
        <option value="">-- Không có cha --</option>
        ${host.orgRoles
          .filter((r) => r.id !== role.id)
          .map((r) => html`<option value=${r.id}>${r.name}</option>`)}
      </select>

      <label class="ag-label">
        Agent đã gán
        (${host.instances.length}${role.maxCount ? ` / ${role.maxCount}` : ""})
      </label>
      <div class="ag-role-instance-list">
        ${host.instances.map(
          (i) => html`
            <div class="ag-role-instance-row">
              <span
                >${host.allAgents.find((a) => a.id === i.agentId)?.name ||
                i.agentId}</span
              >
              <button
                class="ag-danger-btn"
                @click=${() => host._roleH.handleRemoveInstance(i.id)}
              >
                Gỡ
              </button>
            </div>
          `,
        )}
        ${host.instances.length === 0
          ? html`<div class="ag-empty-detail">Chưa có agent nào.</div>`
          : ""}
      </div>

      ${host.addingInstance
        ? addInstanceForm(host)
        : html`
            <div class="ag-actions">
              <button
                class="ag-save-btn"
                ?disabled=${role.maxCount &&
                host.instances.length >= role.maxCount}
                @click=${() => host._roleH.startAddInstance()}
              >
                + Thêm agent
              </button>
            </div>
          `}
      ${!isManager
        ? html`<div class="ag-actions">
            <button
              class="ag-danger-btn"
              @click=${() => host._roleH.handleDeleteRole()}
            >
              Xoá vai trò
            </button>
          </div>`
        : ""}
    </div>
  `;
}
