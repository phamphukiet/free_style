import { html, unsafeCSS } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import editIcon from "lucide-static/icons/pencil.svg?raw";
import trashIcon from "lucide-static/icons/trash-2.svg?raw";
import chevronIcon from "lucide-static/icons/chevron-down.svg?raw";
import platformDropdownStyles from "./platform-dropdown.css?inline";

function addFormTemplate(host) {
  return html`
    <div class="sk-add-link-wrap">
      <div class="sk-add-link-row">
        <input
          class="sk-input"
          placeholder="VD: github hoặc https://skills.example.com"
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

function platformRowTemplate(host, p) {
  if (host.editingPlatformId === p.id) {
    return html`
      <div class="sk-platform-menu-item sk-platform-editing">
        <input
          class="sk-input rename-input"
          .value=${p.name}
          @click=${(e) => e.stopPropagation()}
          @blur=${(e) => host.handleRenamePlatformConfirm(e, p.id)}
          @keydown=${(e) => {
            if (e.key === "Enter") e.target.blur();
            if (e.key === "Escape") {
              e.stopPropagation();
              host.handleRenamePlatformCancel();
            }
          }}
        />
      </div>
    `;
  }
  return html`
    <div
      class="sk-platform-menu-item ${host.platformId === p.id ? "active" : ""}"
    >
      <span
        class="sk-platform-name"
        @click=${() => host.handleSelectPlatformFilter(p.id)}
      >
        ${p.name}
      </span>
      <button
        class="sk-icon-btn sk-platform-mini-btn"
        title="Sửa tên"
        @click=${(e) => {
          e.stopPropagation();
          host.handleRenamePlatformStart(p.id);
        }}
      >
        ${unsafeSVG(editIcon)}
      </button>
      <button
        class="sk-icon-btn sk-platform-mini-btn"
        title="Xoá"
        @click=${(e) => {
          e.stopPropagation();
          host.handleDeletePlatform(p.id);
        }}
      >
        ${unsafeSVG(trashIcon)}
      </button>
    </div>
  `;
}

function dropdownTemplate(host) {
  const current = host.platforms.find((p) => p.id === host.platformId);
  return html`
    <div class="sk-platform-dropdown-wrap">
      <button
        class="sk-icon-btn sk-platform-mini-btn"
        title="Sửa tên"
        @click=${(e) => {
          e.stopPropagation();
          host.handleRenamePlatformStart(p.id);
        }}
      >
        ${unsafeSVG(editIcon)}
      </button>
      ${p.id !== "github"
        ? html`<button
            class="sk-icon-btn sk-platform-mini-btn"
            title="Xoá"
            @click=${(e) => {
              e.stopPropagation();
              host.handleDeletePlatform(p.id);
            }}
          >
            ${unsafeSVG(trashIcon)}
          </button>`
        : ""}
      ${host.platformDropdownOpen
        ? html`
            <div class="sk-platform-menu" @click=${(e) => e.stopPropagation()}>
              <div
                class="sk-platform-menu-item ${!host.platformId
                  ? "active"
                  : ""}"
                @click=${() => host.handleSelectPlatformFilter("")}
              >
                Tất cả nền tảng
              </div>
              ${host.platforms.map((p) => platformRowTemplate(host, p))}
              <div
                class="sk-platform-menu-item sk-platform-add-item"
                @click=${() => host.handleOpenAddPlatform()}
              >
                + Thêm nền tảng...
              </div>
            </div>
          `
        : ""}
    </div>
  `;
}

export function platformDropdownTemplate(host) {
  return html`
    <style>
      ${unsafeCSS(platformDropdownStyles)}
    </style>
    ${host.addingPlatform ? addFormTemplate(host) : dropdownTemplate(host)}
  `;
}
