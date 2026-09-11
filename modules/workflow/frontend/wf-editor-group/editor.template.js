import { html } from "lit";
import { wfTabsTemplate } from "./partial/tabs/tabs.template.js";
import { wfDashboardTemplate } from "./partial/dashboard/dashboard.template.js";
import { stepsEditorTemplate } from "./partial/steps/steps-editor.template.js";
import { runPanelTemplate } from "./partial/run/run-panel.template.js";

function detailTemplate(host) {
  return html`
    <div class="wf-detail">
      <div
        style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;"
      >
        <h2 style="margin:0;">${host.workflow.name}</h2>
        <button
          class="wf-pin-btn ${host.workflow.pinned ? "pinned" : ""}"
          @click=${() => host.handleTogglePin()}
        >
          ${host.workflow.pinned ? "★ Đã ghim" : "☆ Ghim (tự thêm mỗi project)"}
        </button>
      </div>

      <label class="wf-label">Tên workflow</label>
      <input
        class="wf-input"
        .value=${host.editName}
        @input=${host.handleNameInput}
      />

      <label class="wf-label">Mô tả</label>
      <textarea
        class="wf-textarea"
        .value=${host.editDescription}
        @input=${host.handleDescriptionInput}
      ></textarea>

      <label class="wf-label"
        >Các bước (thực thi tuần tự, cross-module qua tool bridge)</label
      >
      ${stepsEditorTemplate(host)}

      <button
        class="wf-btn"
        ?disabled=${host.saving}
        @click=${() => host.handleSave()}
      >
        ${host.saving ? "Đang lưu..." : host.saved ? "Đã lưu!" : "Lưu thay đổi"}
      </button>
      <button class="wf-btn wf-danger" @click=${() => host.handleDelete()}>
        Xoá workflow
      </button>

      ${runPanelTemplate(host)}
    </div>
  `;
}

export function wfEditorTemplate(host) {
  const tabBar = wfTabsTemplate(host);
  const body = host.workflow ? detailTemplate(host) : wfDashboardTemplate(host);
  return html`${tabBar}${body}`;
}
