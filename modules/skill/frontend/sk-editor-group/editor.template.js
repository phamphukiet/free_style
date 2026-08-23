import { html } from "lit";
import { skillTabsTemplate } from "./partial/tabs/tabs.template.js";
import { skDashboardTemplate } from "./partial/dashboard/dashboard.template.js";

function installFormTemplate(host) {
  if (!host.showInstallForm) return html``;
  return html`
    <div class="sk-install-form">
      ${host.skill.installOptions.map(
        (opt) => html`
          <label class="sk-label">${opt.label}</label>
          ${opt.type === "select"
            ? html`<select
                class="sk-select"
                @change=${(e) =>
                  host.handleAnswerInput(opt.key, e.target.value)}
              >
                ${opt.options.map(
                  (o) => html`<option value=${o.value}>${o.label}</option>`,
                )}
              </select>`
            : html`<input
                class="sk-input"
                .value=${host.answers[opt.key] ?? opt.default ?? ""}
                @input=${(e) => host.handleAnswerInput(opt.key, e.target.value)}
              />`}
        `,
      )}
      <button
        class="sk-install-btn"
        @click=${() => host.runInstall(host.answers)}
      >
        Xác nhận cài đặt
      </button>
    </div>
  `;
}

function detailTemplate(host) {
  return html`
    <div class="sk-detail">
      <div class="sk-detail-header">
        <h2>${host.skill.name}</h2>
        <button
          class="sk-pin-btn ${host.skill.pinned ? "pinned" : ""}"
          @click=${() => host.handleTogglePin()}
        >
          ${host.skill.pinned ? "★ Đã ghim" : "☆ Ghim (tự cài mỗi project)"}
        </button>
      </div>
      <div class="sk-detail-meta">
        ★ ${host.skill.rating ?? "—"} · ⬇ ${host.skill.downloads ?? "—"} ·
        v${host.skill.version ?? "?"}
      </div>

      <button
        class="sk-install-btn"
        ?disabled=${host.installing}
        @click=${() => host.handleInstallClick()}
      >
        ${host.installing ? "Đang cài..." : "Cài vào project"}
      </button>
      ${installFormTemplate(host)}

      <h3>Gán cho Agent</h3>
      <div class="sk-agent-list">
        ${host.agents.map(
          (a) => html`
            <label class="sk-agent-row">
              <input
                type="checkbox"
                .checked=${host.checkedAgentIds.includes(a.id)}
                @change=${() => host.toggleAgent(a.id)}
              />
              ${a.name}
            </label>
          `,
        )}
        ${host.agents.length === 0
          ? html`<div class="sk-empty-detail">
              Không có agent nào (hoặc module agent không tồn tại)
            </div>`
          : ""}
      </div>
      <button class="sk-install-btn" @click=${() => host.handleSaveAgents()}>
        Lưu gán agent
      </button>
    </div>
  `;
}

export function skEditorTemplate(host) {
  const tabBar = skillTabsTemplate(host);
  const body = host.skill ? detailTemplate(host) : skDashboardTemplate(host);
  return html`${tabBar}${body}`;
}
