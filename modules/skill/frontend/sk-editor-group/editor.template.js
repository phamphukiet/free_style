import { html } from "lit";

function installFormTemplate(host) {
  if (!host.showInstallForm) return html``;
  return html`
    <div class="sk-install-form">
      ${host.skill.installOptions.map(
        (opt) => html`
          <label class="sk-label">${opt.label}</label>
          ${opt.type === "select"
            ? html`
                <select
                  class="sk-select"
                  @change=${(e) =>
                    host.handleAnswerInput(opt.key, e.target.value)}
                >
                  ${opt.options.map(
                    (o) => html`<option value=${o.value}>${o.label}</option>`,
                  )}
                </select>
              `
            : html`
                <input
                  class="sk-input"
                  .value=${host.answers[opt.key] ?? opt.default ?? ""}
                  @input=${(e) =>
                    host.handleAnswerInput(opt.key, e.target.value)}
                />
              `}
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

export function skEditorTemplate(host) {
  if (!host.skill)
    return html`<div class="sk-empty-detail">Chọn 1 skill ở sidebar</div>`;

  return html`
    <div class="sk-detail">
      <h2>${host.skill.name}</h2>
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
