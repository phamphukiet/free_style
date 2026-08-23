import { html } from "lit";

export function skDashboardTemplate(host) {
  return html`
    <div class="sk-dashboard">
      <div class="sk-dashboard-title">Skills</div>

      ${host.pinnedSkills.length === 0
        ? html`<div class="sk-empty-detail">
            Chưa ghim skill nào. Tìm và chọn skill ở sidebar, sau đó bấm "Ghim"
            để tự động cài mỗi khi mở project.
          </div>`
        : html`
            <div class="sk-section-title">Đã ghim (tự động cài)</div>
            <div class="sk-dash-grid">
              ${host.pinnedSkills.map(
                (s) => html`
                  <div
                    class="sk-dash-card"
                    @click=${() => host.handleSelect({ detail: { id: s.id } })}
                  >
                    <div class="sk-dash-card-title">★ ${s.name}</div>
                    <div class="sk-dash-card-meta">
                      v${s.version ?? "?"} · ${s.platformId ?? "local"}
                    </div>
                  </div>
                `,
              )}
            </div>
          `}
    </div>
  `;
}
