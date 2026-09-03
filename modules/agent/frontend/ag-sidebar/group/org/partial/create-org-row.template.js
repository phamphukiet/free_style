import { html } from "lit";

export function createOrgRow(host) {
  if (!host.orgCreatingOrg) return html``;
  return html`
    <div class="ag-item org-create-row">
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
