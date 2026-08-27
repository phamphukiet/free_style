import { html } from "lit";

export function rlDashboardTemplate(host) {
  return html`
    <div class="rl-dashboard">
      <div class="rl-dashboard-title">Rules</div>
      <button class="rl-btn" @click=${() => host.handleCreateNew()}>
        + Tạo rule mới
      </button>

      ${host.pinnedRules.length === 0
        ? html`<div class="rl-empty-detail">Chưa ghim rule nào.</div>`
        : html`
            <div class="rl-section-title">Đã ghim (tự thêm khi mở project)</div>
            <div class="rl-dash-grid">
              ${host.pinnedRules.map(
                (r) => html`
                  <div
                    class="rl-dash-card"
                    @click=${() => host.handleSelect(r.id)}
                  >
                    <div class="rl-dash-card-title">★ ${r.name}</div>
                    <div class="rl-dash-card-meta">
                      ${(r.agentIds || []).length} agent
                    </div>
                  </div>
                `,
              )}
            </div>
          `}

      <div class="rl-section-title">Tất cả rule</div>
      ${host.allRules.length === 0
        ? html`<div class="rl-empty-detail">
            Chưa có rule nào. Bấm "Tạo rule mới" để bắt đầu.
          </div>`
        : html`
            <div class="rl-dash-grid">
              ${host.allRules.map(
                (r) => html`
                  <div
                    class="rl-dash-card"
                    @click=${() => host.handleSelect(r.id)}
                  >
                    <div class="rl-dash-card-title">
                      ${r.pinned ? "★ " : ""}${r.name}
                    </div>
                    <div class="rl-dash-card-meta">
                      ${(r.agentIds || []).length} agent ·
                      ${r.enabled === false ? "tắt" : "bật"}
                    </div>
                  </div>
                `,
              )}
            </div>
          `}
    </div>
  `;
}
