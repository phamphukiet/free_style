import { html } from "lit";

export function addInstanceForm(host) {
  return html`
    <div class="ag-role-add-form">
      <label class="ag-label">Tên agent</label>
      <input
        class="ag-input"
        .value=${host.newInstanceName}
        @input=${(e) => (host.newInstanceName = e.target.value)}
      />

      <label class="ag-label">API Key</label>
      <select
        class="ag-select"
        .value=${host.newInstanceKeyRef}
        @change=${(e) => host._roleH.handleNewInstanceKey(e.target.value)}
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
        class="ag-select"
        .value=${host.newInstanceModel}
        ?disabled=${host.newInstanceModels.length === 0}
        @change=${(e) => (host.newInstanceModel = e.target.value)}
      >
        <option value="">
          ${host.newInstanceModels.length === 0
            ? "-- Chọn key trước --"
            : "-- Model --"}
        </option>
        ${host.newInstanceModels.map(
          (m) => html`<option value=${m.id}>${m.id}</option>`,
        )}
      </select>

      <div class="ag-actions">
        <button
          class="ag-save-btn"
          @click=${() => host._roleH.handleConfirmAddInstance()}
        >
          Xác nhận
        </button>
        <button
          class="ag-btn-ghost"
          @click=${() => host._roleH.cancelAddInstance()}
        >
          Huỷ
        </button>
      </div>
    </div>
  `;
}
