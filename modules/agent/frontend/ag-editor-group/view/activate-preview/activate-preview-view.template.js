import { html } from "lit";

export function activatePreviewTemplate(host) {
  if (!host.preview) return html`<div class="ag-empty">Đang tải...</div>`;
  const { org, missingRoles, isCurrentlyActive } = host.preview;

  return html`
    <div class="ag-form">
      <h2>Kích hoạt "${org.name}"</h2>
      ${isCurrentlyActive
        ? html`<p class="activate-note">Org này đang được sử dụng.</p>`
        : ""}
      ${missingRoles.length > 0
        ? html`
            <p class="activate-note">
              Các vai trò sau sẽ được tự động tạo agent mới:
            </p>
            <div class="activate-list">
              ${missingRoles.map(
                (r) => html`
                  <div class="activate-row">
                    <span>${r.roleName}</span>
                    <span class="activate-diff">${r.current} → ${r.need}</span>
                  </div>
                `,
              )}
            </div>
          `
        : html`<p class="activate-note">
            Không có thay đổi, đủ agent cho mọi vai trò.
          </p>`}

      <div class="ag-actions">
        <button class="ag-save-btn" @click=${() => host.handleConfirm()}>
          Xác nhận kích hoạt
        </button>
        <button class="ag-btn-ghost" @click=${() => host.handleCancel()}>
          Huỷ
        </button>
      </div>
    </div>
  `;
}
