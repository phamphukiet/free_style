import { html } from "lit";

const STATUS = { running: "Đang chạy", off: "Tắt", error: "Lỗi" };

function rowTemplate(host, item) {
  const running = item.status === "running";
  return html`
    <div class="ext-row">
      <div class="ext-info">
        <div class="ext-name">
          ${item.name}
          <span class="ext-status ${item.status}">${STATUS[item.status]}</span>
        </div>
        <div class="ext-id">${item.id}</div>
        ${item.error ? html`<div class="ext-error">${item.error}</div>` : ""}
      </div>
      <button class="ext-btn" @click=${() => host.handleCode(item)}>
        Lập trình
      </button>
      <button class="ext-btn ext-run" @click=${() => host.handleRun(item)}>
        ${running ? "Dừng" : "Run"}
      </button>
      <button
        class="ext-btn ext-danger"
        @click=${() => host.handleRemove(item)}
      >
        Xoá
      </button>
    </div>
  `;
}

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
      <button class="ext-btn" @click=${() => host.handleToggleSample()}>
        ${host.showSample ? "Ẩn code mẫu" : "Code mẫu"}
      </button>
    </div>
    ${host.showSample
      ? html`<ext-sample .code=${host.sample}></ext-sample>`
      : ""}
    <div class="ext-list">
      ${host.items.map((item) => rowTemplate(host, item))}
      ${host.items.length === 0
        ? html`<div class="ext-empty">Chưa có extension nào</div>`
        : ""}
    </div>
  `;
}
