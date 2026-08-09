import { html } from "lit";

export function stSidebarTemplate(host) {
  const q = host.query.trim().toLowerCase();
  const filtered = host.definitions.filter(
    (d) =>
      !q ||
      d.label.toLowerCase().includes(q) ||
      d.group.toLowerCase().includes(q),
  );
  const groups = [...new Set(filtered.map((d) => d.group))];

  return html`
    <div class="st-search">
      <input
        type="text"
        placeholder="Tìm setting..."
        .value=${host.query}
        @input=${(e) => (host.query = e.target.value)}
      />
    </div>
    <div class="st-list">
      ${groups.length === 0
        ? html`<div class="st-empty">Không tìm thấy setting nào</div>`
        : groups.map(
            (group) => html`
              <div class="section-title">${group}</div>
              ${filtered
                .filter((d) => d.group === group)
                .map(
                  (d) => html`
                    <div
                      class="st-item ${host.selectedId === d.id
                        ? "active"
                        : ""}"
                      @click=${() => host.handleSelect(d.id)}
                    >
                      ${d.label}
                    </div>
                  `,
                )}
            `,
          )}
    </div>
  `;
}
