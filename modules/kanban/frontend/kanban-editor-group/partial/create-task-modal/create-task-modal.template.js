import { html } from "lit";
import { taskFormFieldsTemplate } from "../task_form/task-form-fields.template.js";

export function createTaskModalTemplate(host) {
  return html`
    <div class="ctm-backdrop" @click=${() => host.handleCancel()}>
      <div class="ctm-panel" @click=${(e) => e.stopPropagation()}>
        <h3 class="ctm-title">Task mới</h3>
        ${taskFormFieldsTemplate(host)}
        <div class="ctm-actions">
          <button class="ctm-btn ctm-save" @click=${() => host.handleSubmit()}>
            Tạo task
          </button>
          <button
            class="ctm-btn ctm-cancel"
            @click=${() => host.handleCancel()}
          >
            Huỷ
          </button>
        </div>
      </div>
    </div>
  `;
}
