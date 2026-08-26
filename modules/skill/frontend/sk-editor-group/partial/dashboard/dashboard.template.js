import { html, unsafeCSS } from "lit";
import { skSearchTemplate } from "../search/search.template.js";

const cssMods = import.meta.glob("./*.css", {
  eager: true,
  query: "?inline",
  import: "default",
});
const stylesHtml = Object.values(cssMods).map(
  (s) =>
    html`<style>
      ${unsafeCSS(s)}
    </style>`,
);

export function skDashboardTemplate(host) {
  return html`
    ${stylesHtml}
    <div class="sk-dashboard">
      <div class="sk-dashboard-title">Skills</div>

      ${host.pinnedSkills.length === 0
        ? html`<div class="sk-empty-detail">
            Chưa ghim skill nào. Tìm và chọn skill bên dưới, sau đó bấm "Ghim"
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

      <div class="sk-section-title">Tìm skill</div>
      ${skSearchTemplate(host)}
    </div>
  `;
}
