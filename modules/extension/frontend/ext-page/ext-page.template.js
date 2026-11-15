import { html } from "lit";

export function extPageTemplate(host) {
  return html`
    <h2 class="ext-title">Extension (lập trình)</h2>
    <div class="ext-toolbar">
      <input
        id="ext-name"
        class="ext-input"
        placeholder="Tên extension mới"
        @keydown=${(e) => e.key === "Enter" && host.handleCreate()}
      />
      <button class="ext-btn" @click=${() => host.handleCreate()}>+ Tạo</button>
      <button class="ext-btn" @click=${() => host.handleEnterMode()}>
        Vào chế độ code
      </button>
    </div>
    <div class="ext-list">
      ${host.items.map((item) => html` <ext-item .item=${item}></ext-item> `)}
      ${host.items.length === 0
        ? html`<div class="ext-empty">Chưa có extension nào</div>`
        : ""}
    </div>
    <button
      class="ext-btn ext-sample-btn"
      @click=${() => host.handleToggleSample()}
    >
      ${host.showSample ? "Ẩn code mẫu" : "Code mẫu"}
    </button>
    ${host.showSample
      ? html`<ext-sample .code=${host.sample}></ext-sample>`
      : ""}
  `;
}
