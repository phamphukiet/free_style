import { html } from "lit";

export function dashboardTemplate(host) {
  const groups = [...new Set(host.allItems.map((s) => s.group))];

  return html`
    <div class="st-dashboard-title">Settings</div>
    ${groups.length === 0
      ? html`<div class="st-empty">Chưa có setting nào được đăng ký</div>`
      : html`
          <div class="st-group-grid">
            ${groups.map((group) => {
              const count = host.allItems.filter(
                (s) => s.group === group,
              ).length;
              return html`
                <div
                  class="st-group-card"
                  @click=${() => host.handleSelectGroup(group)}
                >
                  <div class="st-group-card-title">${group}</div>
                  <div class="st-group-card-count">${count} mục</div>
                </div>
              `;
            })}
          </div>
        `}
  `;
}
