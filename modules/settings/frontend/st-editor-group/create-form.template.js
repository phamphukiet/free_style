import { html } from "lit";

export function createFormTemplate(host) {
  const editing = host.editingItem;
  return html`
    <div class="st-create-form">
      <input
        class="st-input"
        id="st-f-id"
        placeholder="id (vd: myGroup.myKey)"
        .value=${editing?.id || ""}
        ?disabled=${!!editing}
      />
      <input
        class="st-input"
        id="st-f-label"
        placeholder="Tên hiển thị"
        .value=${editing?.label || ""}
      />
      <select
        class="st-select"
        id="st-f-type"
        .value=${editing?.type || "string"}
      >
        <option value="string">Text</option>
        <option value="number">Số</option>
        <option value="boolean">Bật/tắt</option>
      </select>
      <input
        class="st-input"
        id="st-f-default"
        placeholder="Giá trị mặc định"
        .value=${editing?.default ?? ""}
      />
      <div class="st-form-actions">
        <button class="st-mini-btn" @click=${() => host.handleFormSubmit()}>
          Lưu
        </button>
        <button class="st-mini-btn" @click=${() => host.handleCancelCreate()}>
          Huỷ
        </button>
      </div>
    </div>
  `;
}
