import { html } from "lit";

const TOOL_OPTIONS = ["rule", "skill", "agent", "files", "workflow"];

export function stepsEditorTemplate(host) {
  return html`
    <div class="wf-steps-list">
      ${host.editSteps.map(
        (s, i) => html`
          <div class="wf-step-row">
            <span class="wf-step-index">${i + 1}</span>
            <input
              class="wf-input wf-step-label"
              placeholder="Nhãn bước"
              .value=${s.label || ""}
              @input=${(e) => host.handleStepChange(i, "label", e.target.value)}
            />
            <select
              class="wf-select"
              .value=${s.tool}
              @change=${(e) => host.handleStepChange(i, "tool", e.target.value)}
            >
              ${TOOL_OPTIONS.map(
                (t) =>
                  html`<option value=${t} ?selected=${s.tool === t}>
                    ${t}
                  </option>`,
              )}
            </select>
            <input
              class="wf-input"
              placeholder="action (VD: create)"
              .value=${s.action || ""}
              @input=${(e) =>
                host.handleStepChange(i, "action", e.target.value)}
            />
            <button
              class="wf-icon-btn"
              title="Xoá bước"
              @click=${() => host.handleRemoveStep(i)}
            >
              ×
            </button>
          </div>
          <textarea
            class="wf-textarea wf-step-args"
            placeholder='argsTemplate JSON, VD: {"name": "{{stepResults.0.result.id}}"}'
            .value=${JSON.stringify(s.argsTemplate || {}, null, 0)}
            @change=${(e) => host.handleStepArgsChange(i, e.target.value)}
          ></textarea>
        `,
      )}
    </div>
    <button class="wf-btn" @click=${() => host.handleAddStep()}>
      + Thêm bước
    </button>
  `;
}
