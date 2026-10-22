import { html } from "lit";

export function presetFormTemplate(host) {
  const target = host.presetTarget;
  return html`
    <div class="st-create-form">
      <div class="st-item-label">Thêm mẫu cho "${target.label}"</div>
      <input class="st-input" id="st-p-label" placeholder="Tên mẫu" />
      <textarea
        class="st-input st-textarea"
        id="st-p-data"
        rows="6"
        placeholder=${target.hint || "Dữ liệu mẫu (JSON)"}
      ></textarea>
      <div class="st-form-actions">
        <button class="st-mini-btn" @click=${() => host.handlePresetSubmit()}>
          Lưu
        </button>
        <button class="st-mini-btn" @click=${() => host.handleCancelPreset()}>
          Huỷ
        </button>
      </div>
    </div>
  `;
}
