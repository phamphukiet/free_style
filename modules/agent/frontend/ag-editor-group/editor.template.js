import { html } from "lit";

export function agEditorTemplate(host) {
  if (!host.agentId) {
    return html`<div class="ag-empty">
      Chọn hoặc tạo agent ở sidebar bên trái
    </div>`;
  }

  return html`
    <div class="ag-form">
      <h2>Cấu hình Agent</h2>

      <label class="ag-label">Tên agent</label>
      <input
        class="ag-input"
        .value=${host.editName}
        @input=${(e) => host.handleNameInput(e)}
      />

      <label class="ag-label">API Key</label>
      <select
        class="ag-select"
        .value=${host.selectedKeyRef}
        @change=${(e) => host.handleKeyChange(e.target.value)}
      >
        <option value="">-- Chọn key --</option>
        ${host.keys.map(
          (k) =>
            html`<option value=${`${k.providerId}:${k.id}`}>
              ${k.providerName} · ${k.name}
            </option>`,
        )}
      </select>

      <label class="ag-label">Model</label>
      <select
        class="ag-select ag-model-select"
        .value=${host.selectedModel}
        ?disabled=${host.models.length === 0}
        @change=${(e) => (host.selectedModel = e.target.value)}
      >
        <option value="">
          ${host.models.length === 0 ? "-- Chọn key trước --" : "-- Model --"}
        </option>
        ${host.models.map((m) => html`<option value=${m.id}>${m.id}</option>`)}
      </select>

      <div class="ag-actions">
        <button class="ag-save-btn" @click=${() => host.handleSave()}>
          ${host.saved ? "Đã lưu!" : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  `;
}
