import { html } from "lit";
import { registry } from "@modules/registry.js";

export function dashboardTemplate(host) {
  const providers = registry.getProviders();
  const groups = [...new Set(providers.map((p) => p.group))];

  return html`
    <div class="provider-dashboard">
      <div class="dashboard-title">Providers</div>
      
      ${groups.map(
        (group) => html`
          <div class="provider-group">
            <div class="group-title">${group}</div>
            <div class="provider-grid">
              ${providers.filter((p) => p.group === group).map(
                (p) => html`
                  <div class="provider-card" @click=${() => host.handleSelect(p.id)}>
                    <div
                      class="provider-icon-large"
                      style="background:${p.color}; color:${p.textColor ?? "#fff"}"
                    >
                      ${p.abbr}
                    </div>
                    <div class="provider-info">
                      <div class="provider-name">${p.name}</div>
                      <div class="provider-desc">${p.desc}</div>
                      <div class="provider-tags">
                        ${(p.tags || []).map((tag) => html`<span class="tag">${tag}</span>`)}
                      </div>
                    </div>
                  </div>
                `
              )}
            </div>
          </div>
        `
      )}
    </div>
  `;
}
