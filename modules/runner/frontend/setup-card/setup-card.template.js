// modules/runner/frontend/setup-card/setup-card.template.js
import { html, nothing } from "lit";

const actions = (...buttons) => html`<div class="actions">${buttons}</div>`;

const BODY = {
  ask: (h) => html`
    <p>
      ${h.info.label} chưa có trên
      máy${h.info.sizeMB ? ` (gói tải ~${h.info.sizeMB} MB)` : ""}. Cài đặt tự
      động?
    </p>
    ${actions(
      html`<button class="primary" @click=${() => h.handleInstall()}>
        Cài đặt ${h.info.label}
      </button>`,
      html`<button @click=${() => h.handleClose()}>Để sau</button>`,
    )}
  `,
  installing: (h) => html`
    <p>Đang cài ${h.info.label}: ${h.message || `${h.percent}%`}</p>
    <div class="bar"><div class="fill" style="width:${h.percent}%"></div></div>
  `,
  done: (h) => html`
    <p>Đã cài xong ${h.info.label}. Bấm ▶ Run để chạy file.</p>
    ${actions(html`<button @click=${() => h.handleClose()}>Đóng</button>`)}
  `,
  error: (h) => html`
    <p class="error">Cài đặt thất bại: ${h.message}</p>
    ${actions(
      html`<button class="primary" @click=${() => h.handleInstall()}>
        Thử lại
      </button>`,
      html`<button @click=${() => h.handleClose()}>Đóng</button>`,
    )}
  `,
};

export function setupCardTemplate(host) {
  if (!host.info) return nothing;
  return html`<div class="card">${BODY[host.phase](host)}</div>`;
}
