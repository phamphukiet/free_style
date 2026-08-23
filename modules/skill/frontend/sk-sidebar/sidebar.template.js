import { html } from "lit";
import { classMap } from "lit/directives/class-map.js";

function pinnedSection(host) {
  if (!host.pinnedSkills.length) return html``;
  return html`
    <div class="sk-pinned-section">
      <div class="sk-section-title">Đã ghim</div>
      ${host.pinnedSkills.map(
        (s) => html`
          <div
            class=${classMap({
              "sk-item": true,
              "sk-item-compact": true,
              active: host.selectedId === s.id,
            })}
            @click=${() => host.handleSelect(s.id)}
          >
            <span class="sk-item-name">★ ${s.name}</span>
          </div>
        `,
      )}
    </div>
  `;
}

export function skSidebarTemplate(host) {
  return html`
    ${pinnedSection(host)}
    <div class="sk-search-row">
      <input
        class="sk-search-input"
        placeholder="Tìm skill..."
        .value=${host.query}
        @input=${(e) => host.handleQueryInput(e)}
      />
      <select
        class="sk-sort-select"
        .value=${host.sortBy}
        @change=${(e) => host.handleSortChange(e.target.value)}
      >
        <option value="rating">Đánh giá</option>
        <option value="downloads">Lượt tải</option>
      </select>
    </div>
    <div class="sk-list">
      ${host.results.map(
        (s) => html`
          <div
            class=${classMap({
              "sk-item": true,
              active: host.selectedId === s.id,
            })}
            @click=${() => host.handleSelect(s.id)}
          >
            <span class="sk-item-name">${s.name}</span>
            <span class="sk-item-meta"
              >★ ${s.rating ?? "—"} · ⬇ ${s.downloads ?? "—"}</span
            >
          </div>
        `,
      )}
      ${host.results.length === 0
        ? html`<div class="sk-empty">Không tìm thấy skill</div>`
        : ""}
    </div>
  `;
}