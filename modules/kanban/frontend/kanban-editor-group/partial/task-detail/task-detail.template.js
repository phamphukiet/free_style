import { html } from "lit";
import { taskFormFieldsTemplate } from "../task_form/task-form-fields.template.js";

export function taskDetailTemplate(host) {
  return html`
    <div class="td-panel" @click=${(e) => e.stopPropagation()}>
      <div class="td-header">
        <strong>Chi tiết task</strong>
        <button class="td-close-btn" @click=${() => host.handleClose()}>
          ×
        </button>
      </div>
      <div class="td-body">${taskFormFieldsTemplate(host)}</div>
      <div class="td-actions">
        <button class="td-save-btn" @click=${() => host.handleSave()}>
          ${host.saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        <button class="td-delete-btn" @click=${() => host.handleDelete()}>
          Xoá task
        </button>
      </div>
    </div>
  `;
}
