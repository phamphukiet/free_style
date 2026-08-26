import { html } from "lit";

export function importLinkTemplate(host) {
  return html`
    <div class="sk-import-link-row">
      <input
        class="sk-input"
        placeholder="Dán link SKILL.md (raw GitHub, unpkg, blog...)"
        .value=${host.importLinkUrl}
        @input=${(e) => host.handleImportLinkInput(e)}
        @keydown=${(e) => {
          if (e.key === "Enter") host.handleImportLinkConfirm();
        }}
        ?disabled=${host.importLinkLoading}
      />
      <button
        class="sk-install-btn"
        ?disabled=${host.importLinkLoading || !host.importLinkUrl.trim()}
        @click=${() => host.handleImportLinkConfirm()}
      >
        ${host.importLinkLoading ? "Đang tải..." : "Tải"}
      </button>
    </div>
    ${host.importLinkStatus
      ? html`<div class="sk-add-link-error">${host.importLinkStatus}</div>`
      : ""}
  `;
}
