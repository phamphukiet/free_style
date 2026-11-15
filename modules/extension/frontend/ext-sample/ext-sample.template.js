import { html } from "lit";

export function extSampleTemplate(host) {
  return html`
    <div class="sample-head">
      <span>Mẫu tự động lưu: dán vào file index.js của extension</span>
      <button class="sample-copy" @click=${() => host.handleCopy()}>
        ${host.copied ? "Đã chép ✓" : "Copy"}
      </button>
    </div>
    <pre class="sample-code">${host.code}</pre>
  `;
}
