import { html } from "lit";
import { rlTabsTemplate } from "../partial/tabs/tabs.template.js";
import { rlDashboardTemplate } from "../partial/dashboard/dashboard.template.js";

function detailTemplate(host) {
  return html`
    <div class="rl-detail">
      <div
        style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;"
      >
        <h2 style="margin:0;">${host.rule.name}</h2>
        <button
          class="rl-pin-btn ${host.rule.pinned ? "pinned" : ""}"
          @click=${() => host.handleTogglePin()}
        >
          ${host.rule.pinned ? "★ Đã ghim" : "☆ Ghim (tự thêm mỗi project)"}
        </button>
      </div>
      <div class="rl-detail-meta">
        ${host.rule.enabled === false ? "Đã tắt" : "Đang bật"} ·
        <a @click=${() => host.handleToggleEnabled()}>
          ${host.rule.enabled === false ? "Bật lại" : "Tắt rule"}
        </a>
      </div>

      <label class="rl-label">Tên rule</label>
      <input
        class="rl-input"
        .value=${host.editName}
        @input=${host.handleNameInput}
      />

      <label class="rl-label">Nội dung</label>
      <textarea
        class="rl-textarea"
        .value=${host.editContent}
        @input=${host.handleContentInput}
      ></textarea>

      <h3>Gán cho Agent</h3>
      <div class="rl-agent-list">
        ${host.agents.map(
          (a) => html`
            <label class="rl-agent-row">
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
          ? html`<div class="rl-empty-detail">
              Không có agent nào (hoặc module agent không tồn tại)
            </div>`
          : ""}
      </div>

      <button
        class="rl-btn"
        ?disabled=${host.saving}
        @click=${() => host.handleSave()}
      >
        ${host.saving ? "Đang lưu..." : host.saved ? "Đã lưu!" : "Lưu thay đổi"}
      </button>
      <button class="rl-btn rl-danger" @click=${() => host.handleDelete()}>
        Xoá rule
      </button>
    </div>
  `;
}

export function rlEditorTemplate(host) {
  const tabBar = rlTabsTemplate(host);
  const body = host.rule ? detailTemplate(host) : rlDashboardTemplate(host);
  return html`${tabBar}${body}`;
}
