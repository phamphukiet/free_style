import { html } from "lit";

function roleName(roles, id) {
  return roles.find((r) => r.id === id)?.name || id;
}

export function remapViewTemplate(host) {
  const diff = host.diff;
  if (!diff)
    return html`<div class="ag-empty">Không có thay đổi nào đang chờ.</div>`;

  const { oldRoles, newRoles, instancesByOldRole } = diff;
  const rows = Object.keys(instancesByOldRole);

  return html`
    <div class="ag-form">
      <h2>Sắp xếp lại vai trò</h2>
      <p class="remap-hint">
        Đang đổi mô hình tổ chức. Chọn vai trò mới cho agent thuộc vai trò cũ,
        hoặc để "Xóa" nếu muốn bàn giao (gỡ khỏi org).
      </p>

      <div class="ag-actions">
        <button class="ag-btn-ghost" @click=${() => host.handleAutoArrange()}>
          Tự sắp xếp
        </button>
      </div>

      <div class="remap-list">
        ${rows.map((oldRoleId) => {
          const instances = instancesByOldRole[oldRoleId];
          return html`
            <div class="remap-row">
              <div class="remap-old">
                ${roleName(oldRoles, oldRoleId)}
                <span class="remap-count">(${instances.length} agent)</span>
              </div>
              <span class="remap-arrow">→</span>
              <select
                class="ag-select"
                .value=${host.mapping[oldRoleId] || ""}
                @change=${(e) =>
                  host.handleMapChange(oldRoleId, e.target.value)}
              >
                <option value="">-- Xóa (bàn giao) --</option>
                ${newRoles.map(
                  (r) => html`<option value=${r.id}>${r.name}</option>`,
                )}
              </select>
            </div>
          `;
        })}
      </div>

      <div class="ag-actions remap-confirm-row">
        <button class="ag-save-btn" @click=${() => host.handleConfirm()}>
          Xác nhận đổi
        </button>
        <button class="ag-btn-ghost" @click=${() => host.handleCancel()}>
          Hủy
        </button>
      </div>
    </div>
  `;
}
