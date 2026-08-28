import { html } from "lit";

export function toastTemplate(host) {
  return html`${host.items.map(
    (t) => html`<div class="toast-item">${t.message}</div>`,
  )}`;
}
