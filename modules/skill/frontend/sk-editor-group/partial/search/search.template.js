import { html, unsafeCSS } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import downloadIcon from "lucide-static/icons/download.svg?raw";
import externalLinkIcon from "lucide-static/icons/external-link.svg?raw";
import { platformDropdownTemplate } from "../platform/platform-dropdown.template.js";

const cssMods = import.meta.glob("./*.css", {
  eager: true,
  query: "?inline",
  import: "default",
});
const stylesHtml = Object.values(cssMods).map(
  (s) =>
    html`<style>
      ${unsafeCSS(s)}
    </style>`,
);

function platformSelectTemplate(host) {
  if (host.addingPlatform) {
    return html`
      <div class="sk-add-link-wrap">
        <div class="sk-add-link-row">
          <input
            class="sk-input"
            placeholder="VD: github hoặc https://github.com/"
            .value=${host.addLinkUrl}
            @input=${(e) => (host.addLinkUrl = e.target.value)}
            @keydown=${(e) => {
              if (e.key === "Enter") host.handleAddLinkConfirm();
              if (e.key === "Escape") host.handleAddLinkCancel();
            }}
            ?disabled=${host.addLinkLoading}
          />
          <button
            class="sk-icon-btn"
            title="Xác nhận"
            ?disabled=${host.addLinkLoading || !host.addLinkUrl.trim()}
            @click=${() => host.handleAddLinkConfirm()}
          >
            ${host.addLinkLoading ? "..." : "✓"}
          </button>
          <button
            class="sk-icon-btn"
            title="Huỷ"
            @click=${() => host.handleAddLinkCancel()}
          >
            ×
          </button>
        </div>
        ${host.addLinkStatus
          ? html`<div class="sk-add-link-error">${host.addLinkStatus}</div>`
          : ""}
      </div>
    `;
  }

  return html`
    <select
      class="sk-sort-select"
      .value=${host.platformId}
      @change=${(e) => host.handlePlatformChange(e.target.value)}
    >
      <option value="">Tất cả nền tảng</option>
      ${host.platforms.map(
        (p) => html`<option value=${p.id}>${p.name}</option>`,
      )}
      <option value=${ADD_PLATFORM_VALUE}>+ Thêm nền tảng...</option>
    </select>
  `;
}

function resultItemTemplate(host, item) {
  return html`
    <div class="sk-result-item">
      <div
        class="sk-result-info"
        @click=${() => host.handleSelect({ detail: { id: item.id } })}
      >
        <div class="sk-item-name">${item.name}</div>
        <div class="sk-item-meta">
          ★ ${item.rating ?? "—"} · ⬇ ${item.downloads ?? "—"}
        </div>
      </div>
      <div class="sk-result-actions">
        <button
          class="sk-icon-btn"
          title="Tải về"
          @click=${() => host.handleQuickInstall(item)}
        >
          ${unsafeSVG(downloadIcon)}
        </button>
        <button
          class="sk-icon-btn"
          title="Xem"
          @click=${() => host.handleViewSource(item)}
        >
          ${unsafeSVG(externalLinkIcon)}
        </button>
      </div>
    </div>
  `;
}

export function skSearchTemplate(host) {
  return html`
    ${stylesHtml}
    <div class="sk-search">
      <div class="sk-search-row">
        <input
          class="sk-search-input"
          placeholder="\"github\" hoặc \"npm\""
          .value=${host.query}
          @input=${(e) => host.handleQueryInput(e)}
        />
      </div>
      <div class="sk-search-row">
        ${platformDropdownTemplate(host)}
        <select
          class="sk-sort-select"
          .value=${host.sortBy}
          @change=${(e) => host.handleSortChange(e.target.value)}
        >
          <option value="rating">Đánh giá cao nhất</option>
          <option value="downloads">Dùng nhiều nhất</option>
        </select>
      </div>
      <div class="sk-result-list">
        ${
          host.results.length === 0
            ? html`<div class="sk-section-empty">Không tìm thấy skill</div>`
            : host.results.map((item) => resultItemTemplate(host, item))
        }
      </div>
    </div>
  `;
}
