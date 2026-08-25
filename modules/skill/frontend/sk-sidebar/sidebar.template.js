import { html } from "lit";
import { sectionTemplate } from "./partial/section/section.template.js";

function searchToolbar(host) {
  return html`
    <div class="sk-search-row">
      <input
        class="sk-search-input"
        placeholder="Tìm skill (VD: frontend)..."
        .value=${host.query}
        @input=${(e) => host.handleQueryInput(e)}
      />
    </div>
    <div class="sk-search-row">
      <select
        class="sk-sort-select"
        .value=${host.platformId}
        @change=${(e) => host.handlePlatformChange(e.target.value)}
      >
        <option value="">Tất cả nền tảng</option>
        ${host.platforms.map(
          (p) => html`<option value=${p.id}>${p.name}</option>`,
        )}
      </select>
      <select
        class="sk-sort-select"
        .value=${host.sortBy}
        @change=${(e) => host.handleSortChange(e.target.value)}
      >
        <option value="rating">Đánh giá cao nhất</option>
        <option value="downloads">Dùng nhiều nhất</option>
      </select>
    </div>
  `;
}

export function skSidebarTemplate(host) {
  const [projectSection, pinnedSection, resultsSection] = host.sections;
  return html`
    ${sectionTemplate(host, projectSection)}
    ${sectionTemplate(host, pinnedSection)} ${searchToolbar(host)}
    ${sectionTemplate(host, resultsSection)}
  `;
}
