import { html } from "lit";

export function sampleListTemplate(host) {
  const sorted = [...host.presets].sort(
    (a, b) =>
      (a.id === host.lastUsedPresetId ? -1 : 0) -
      (b.id === host.lastUsedPresetId ? -1 : 0),
  );
  return html`
    <div class="org-empty-hint">Chưa mở project — mẫu tổ chức tham khảo:</div>
    ${sorted.map(
      (p) => html`
        <div class="ag-item ${p.id === host.lastUsedPresetId ? "active" : ""}">
          <span class="ag-item-name">${p.name}</span>
          ${p.id === host.lastUsedPresetId
            ? html`<span class="org-badge">Đang dùng</span>`
            : ""}
        </div>
      `,
    )}
  `;
}
