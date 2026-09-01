import { html } from "lit";

function projectBarTemplate(host) {
  const limitBytes = host.fileLimitMB * 1048576;
  const pct = Math.min(100, Math.round((host.currentBytes / limitBytes) * 100));
  const color = pct >= 90 ? "#f44747" : pct >= 70 ? "#cca700" : "#4ec9b0";
  const fmt = (b) =>
    b >= 1048576
      ? (b / 1048576).toFixed(1) + " MB"
      : (b / 1024).toFixed(0) + " KB";
  return html`
    <div class="ag-project-bar-row">
      <div class="ag-project-bar-track">
        <div
          class="ag-project-bar-fill"
          style="width:${pct}%; background:${color}"
        ></div>
      </div>
      <span class="ag-project-bar-label"
        >${fmt(host.currentBytes)} / ${host.fileLimitMB} MB (${pct}%)</span
      >
    </div>
  `;
}

export function agentViewTemplate(host) {
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

      <label class="ag-label">Dung lượng project đang mở</label>
      ${projectBarTemplate(host)}

      <div class="ag-actions">
        <button class="ag-save-btn" @click=${() => host.handleSave()}>
          ${host.saved ? "Đã lưu!" : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  `;
}
