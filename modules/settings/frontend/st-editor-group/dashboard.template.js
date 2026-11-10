import { html } from "lit";
import { listPages } from "../pages.js";

export function dashboardTemplate(host) {
  const groups = [...new Set(host.allItems.map((s) => s.group))];
  const pages = listPages();

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
    ${pages.length === 0
      ? ""
      : html`<div class="st-group-grid" style="margin-top:14px">
          ${pages.map(
            (page) => html`
              <div
                class="st-group-card"
                @click=${() => host.handleSelectGroup(page.id)}
              >
                <div class="st-group-card-title">${page.label}</div>
              </div>
            `,
          )}
        </div>`}
  `;
}
