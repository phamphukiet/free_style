import { html } from "lit";

export function createOrgRow(host) {
  if (!host.orgCreatingOrg) return html``;
  return html`
    <div class="ag-item org-create-row">
      <select
        class="org-parent-select"
        .value=${host.newOrgPresetId}
        @change=${(e) => (host.newOrgPresetId = e.target.value)}
      >
        <option value="">-- Trống --</option>
        ${host.orgPresets.map(
          (p) => html`<option value=${p.id}>${p.name}</option>`,
        )}
      </select>
      <input
        class="rename-input create-input"
        placeholder="Tên org"
        .value=${host.newOrgName}
        @input=${(e) => (host.newOrgName = e.target.value)}
        @keydown=${(e) => {
          if (e.key === "Enter") host.confirmCreateOrg();
          if (e.key === "Escape") host.cancelCreateOrg();
        }}
      />
      <button
        class="icon-btn"
        title="Tạo"
        @click=${() => host.confirmCreateOrg()}
      >
        ✓
      </button>
      <button
        class="icon-btn"
        title="Huỷ"
        @click=${() => host.cancelCreateOrg()}
      >
        ✕
      </button>
    </div>
  `;
}
