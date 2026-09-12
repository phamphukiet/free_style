import { html } from "lit";
import { agentColor } from "./agent-color.js";

export function taskFormFieldsTemplate(host) {
  return html`
    <label class="tf-label">Tên task</label>
    <input
      class="tf-input"
      .value=${host.formTitle}
      @input=${(e) => (host.formTitle = e.target.value)}
      placeholder="VD: Sửa lỗi đăng nhập"
    />

    <label class="tf-label">Agent</label>
    <select
      class="tf-select"
      .value=${host.formAgentId}
      @change=${(e) => (host.formAgentId = e.target.value)}
    >
      ${host.agents.map(
        (a) =>
          html`<option value=${a.id} style="color:${agentColor(a.id)}">
            ${a.name}
          </option>`,
      )}
    </select>

    <label class="tf-label">Kỳ vọng (không bắt buộc)</label>
    <textarea
      class="tf-textarea"
      rows="3"
      .value=${host.formDescription}
      @input=${(e) => (host.formDescription = e.target.value)}
      placeholder="Mô tả kết quả mong muốn..."
    ></textarea>
  `;
}
