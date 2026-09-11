import { html } from "lit";

export function wfDashboardTemplate(host) {
  return html`
    <div class="wf-dashboard">
      <div class="wf-dashboard-title">Workflow</div>
      <button class="wf-btn" @click=${() => host.handleCreateNew()}>
        + Tạo workflow mới
      </button>

      ${host.pinnedWorkflows.length === 0
        ? html`<div class="wf-empty-detail">Chưa ghim workflow nào.</div>`
        : html`
            <div class="wf-section-title">Đã ghim (tự thêm khi mở project)</div>
            <div class="wf-dash-grid">
              ${host.pinnedWorkflows.map(
                (w) => html`
                  <div
                    class="wf-dash-card"
                    @click=${() => host.handleSelect(w.id)}
                  >
                    <div class="wf-dash-card-title">★ ${w.name}</div>
                    <div class="wf-dash-card-meta">
                      ${(w.steps || []).length} bước
                    </div>
                  </div>
                `,
              )}
            </div>
          `}

      <div class="wf-section-title">Tất cả workflow</div>
      ${host.allWorkflows.length === 0
        ? html`<div class="wf-empty-detail">
            Chưa có workflow nào. Bấm "Tạo workflow mới" để bắt đầu.
          </div>`
        : html`
            <div class="wf-dash-grid">
              ${host.allWorkflows.map(
                (w) => html`
                  <div
                    class="wf-dash-card"
                    @click=${() => host.handleSelect(w.id)}
                  >
                    <div class="wf-dash-card-title">
                      ${w.pinned ? "★ " : ""}${w.name}
                    </div>
                    <div class="wf-dash-card-meta">
                      ${(w.steps || []).length} bước
                    </div>
                  </div>
                `,
              )}
            </div>
          `}
    </div>
  `;
}
