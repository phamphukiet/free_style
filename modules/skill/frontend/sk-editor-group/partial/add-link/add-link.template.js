import { html } from "lit";

export function addLinkTemplate(host) {
  return html`
    <div class="sk-add-link">
      <div class="sk-section-title">Thêm nền tảng tìm kiếm</div>
      <div class="sk-add-link-row">
        <input
          class="sk-input"
          placeholder="VD: github hoặc https://github.com/"
          .value=${host.addLinkUrl}
          @input=${(e) => (host.addLinkUrl = e.target.value)}
          @keydown=${(e) => {
            if (e.key === "Enter") host.handleAddLink();
          }}
          ?disabled=${host.addLinkLoading}
        />
        <button
          class="sk-install-btn"
          ?disabled=${host.addLinkLoading || !host.addLinkUrl.trim()}
          @click=${() => host.handleAddLink()}
        >
          ${host.addLinkLoading ? "Đang thêm..." : "Thêm"}
        </button>
      </div>
      ${host.addLinkStatus
        ? html`<div class="sk-add-link-error">${host.addLinkStatus}</div>`
        : ""}
    </div>
  `;
}
